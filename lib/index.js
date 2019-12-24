'use strict';

module.exports = function(babel) {
  var CLEAN_XML_SPACES_REGEX = /(\r?\n)\s+/g;
  var CLEAN_XML_ATTRIBUTES_VALUES_REGEX = /\s*=\s*'?"?\{(\w*)\}'?"?/g;
  var CLEAN_XML_ATTRIBUTES_VALUES_REPLACE = '="{$1}"';
  var MAX_INTERPOLATE_VARIABLE_ITERATIONS = 10000;

  var t = babel.types;

  return {
    inherits: require('@babel/plugin-syntax-jsx').default,
    visitor: {
      JSXElement: {
        exit(path, file) {
          if (isInsideJsxElement(path)) {
            return;
          }
          var xmlString = buildXmlString(path);
          if (xmlString) {
            var resultIdentifier = getResultIdentifier(path);
            var newXmlExpression = createNewXmlExpression(xmlString);
            addExpressionToPath(path, resultIdentifier, newXmlExpression);
          }
        }
      },
      Program: {
        enter(path, state) {
          if (containsJsxElement(path)) {
            path.unshiftContainer('body', createRequireXmlExpression());
          }
        }
      }
    }
  };

  /**
   * Check if path is inside of a JsxElement
   * @param {path} path - Babel path
   * @returns {boolean} true if path is inside of a JsxElement
   */
  function isInsideJsxElement(path) {
    return path.parentPath ? t.isJSXElement(path.parentPath) : false;
  }

  /**
   * Check if path contains a JsxElement
   * @param {path} path - Babel path
   * @returns {boolean} true if path constains a JsxElement
   */
  function containsJsxElement(path) {
    const jsxChecker = {
      hasJsx: false
    };
    path.traverse(
      {
        JSXElement() {
          this.hasJsx = true;
        }
      },
      jsxChecker
    );
    return jsxChecker.hasJsx;
  }

  /**
   * Find the parent path and add the built expression to it.
   * @param {path} path - Babel path
   * @returns {path} parentPath
   */
  function addExpressionToPath(path, identifier, expression) {
    var parentPath = path && path.parentPath;
    if (!parentPath) {
      path.replaceWith(expression);
    } else if (t.isAssignmentExpression(parentPath)) {
      parentPath.replaceWith(expression);
    } else if (t.isVariableDeclarator(parentPath)) {
      parentPath.parentPath.replaceWith(
        t.variableDeclaration('var', [
          t.variableDeclarator(t.identifier(identifier.name), expression)
        ])
      );
    } else if (t.isBinaryExpression(parentPath)) {
      parentPath.replaceWith(
        t.callExpression(
          t.memberExpression(parentPath.node.left, t.identifier('appendChild')),
          [expression]
        )
      );
    } else {
      path.replaceWith(expression);
    }
  }

  /**
   * Transform JsxElement to a xml string.
   *
   * @param {path} path - Babel path
   * @returns {expression}
   */
  function buildXmlString(path) {
    var expression;

    var xmlTemplate = path.toString().replace(CLEAN_XML_SPACES_REGEX, '');
    if (xmlTemplate.indexOf('{') > -1) {
      var xmlTemplate = xmlTemplate.replace(CLEAN_XML_ATTRIBUTES_VALUES_REGEX, CLEAN_XML_ATTRIBUTES_VALUES_REPLACE);
    }

    var iteration = 0;
    var finish = false;
    while (!finish && iteration < MAX_INTERPOLATE_VARIABLE_ITERATIONS) {
      var interpolateExpressionStartIndex = xmlTemplate.indexOf('{');
      var interpolateExpressionEndIndex = calculateInterpolateExpressionEndIndex(xmlTemplate, interpolateExpressionStartIndex);
      if (
        interpolateExpressionStartIndex > -1 &&
        interpolateExpressionEndIndex > -1 &&
        interpolateExpressionStartIndex < interpolateExpressionEndIndex
      ) {
        expression = createXmlInterpolateExpressionTemplatePortionExpression(
          expression,
          xmlTemplate,
          interpolateExpressionStartIndex,
          interpolateExpressionEndIndex
        );
        xmlTemplate = xmlTemplate.substring(interpolateExpressionEndIndex + 1, xmlTemplate.length);
        iteration++;
      } else {
        expression = createXmlTemplateExpression(expression, xmlTemplate);
        finish = true;
      }
    }

    return expression;
  }

  function calculateInterpolateExpressionEndIndex(xmlTemplate, interpolateExpressionStartIndex) {
    var interpolateExpressionEndIndex = xmlTemplate.indexOf('}');
    var preIndex = interpolateExpressionStartIndex + 1;
    var endIndex = interpolateExpressionEndIndex;
    while (xmlTemplate.substring(preIndex, interpolateExpressionEndIndex).indexOf('{') > -1 && endIndex > 0) {
      preIndex = preIndex + xmlTemplate.substring(preIndex, interpolateExpressionEndIndex).indexOf('{');
      var endIndex = xmlTemplate.substring(interpolateExpressionEndIndex + 1).indexOf('}') + 1;
      interpolateExpressionEndIndex += endIndex;
    }
    return interpolateExpressionEndIndex;
  }

  function createXmlInterpolateExpressionTemplatePortionExpression(
    startExpression,
    xmlTemplate,
    interpolateExpressionStartIndex,
    interpolateExpressionEndIndex
  ) {
    var expression = startExpression
      ? t.binaryExpression(
          '+',
          startExpression,
          t.stringLiteral(xmlTemplate.substring(0, interpolateExpressionStartIndex))
        )
      : t.stringLiteral(xmlTemplate.substring(0, interpolateExpressionStartIndex));
    return t.binaryExpression(
      '+',
      expression,
      t.identifier(xmlTemplate.substring(interpolateExpressionStartIndex + 1, interpolateExpressionEndIndex))
    );
  }

  function createXmlTemplateExpression(startExpression, xmlTemplate) {
    return startExpression
      ? t.binaryExpression('+', startExpression, t.stringLiteral(xmlTemplate))
      : t.stringLiteral(xmlTemplate);
  }

  /**
   * Create the require XML expression.
   * @example
   *   var XML = require("simple4x");
   *
   * @param {expression} xmlString - xml to parse as string expression
   * @returns {callExpression}
   */
  function createRequireXmlExpression() {
    return t.variableDeclaration('var', [
      t.variableDeclarator(t.identifier('XML'), t.callExpression(t.identifier('require'), [t.stringLiteral('simple4x')]))
    ]);
  }

  /**
   * Create the new XML expression.
   * @example
   *   var xml = new XML(xmlString);
   *
   * @param {expression} xmlString - xml to parse as string expression
   * @returns {callExpression}
   */
  function createNewXmlExpression(xmlString) {
    return t.newExpression(t.identifier('XML'), [xmlString]);
  }

  /**
   * Get variable identifier to store xml result.
   *
   * @param {path} path - Babel path
   * @returns {identifier}
   */
  function getResultIdentifier(path) {
    var result;
    var parentNode = path && path.parentPath && path.parentPath.node;
    if (!parentNode) {
      result = t.identifier("nullParentNode");
    } else if (t.isAssignmentExpression(parentNode)) {
      result = parentNode.left;
    } else if (t.isVariableDeclarator(parentNode)) {
      result = parentNode.id;
    } else {
      result = t.identifier("identifierNotFound");
    }
    return result;
  }
};
