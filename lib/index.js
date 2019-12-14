'use strict';

module.exports = function(babel) {
  var CLEAN_XML_SPACES_REGEX = /\r?\n\s+/g;
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
          var xmlString = buildXmlString(path, file);
          if (xmlString) {
            var resultIdentifier = getResultIdentifier(path);
            var newXmlExpression = createNewXmlExpression(xmlString);
            addExpressionToPath(path, resultIdentifier, newXmlExpression);
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
      var interpolateVariableStartIndex = xmlTemplate.indexOf('{');
      var interpolateVariableEndIndex = xmlTemplate.indexOf('}');
      if (
        interpolateVariableStartIndex > -1 &&
        interpolateVariableEndIndex > -1 &&
        interpolateVariableStartIndex < interpolateVariableEndIndex
      ) {
        expression = createXmlInterpolateVariableTemplatePortionExpression(
          expression,
          xmlTemplate,
          interpolateVariableStartIndex,
          interpolateVariableEndIndex
        );
        xmlTemplate = xmlTemplate.substring(interpolateVariableEndIndex + 1, xmlTemplate.length);
        iteration++;
      } else {
        expression = createXmlTemplateExpression(expression, xmlTemplate);
        finish = true;
      }
    }

    return expression;
  }

  function createXmlInterpolateVariableTemplatePortionExpression(
    startExpression,
    xmlTemplate,
    interpolateVariableStartIndex,
    interpolateVariableEndIndex
  ) {
    var expression = startExpression
      ? t.binaryExpression(
          '+',
          startExpression,
          t.stringLiteral(xmlTemplate.substring(0, interpolateVariableStartIndex))
        )
      : t.stringLiteral(xmlTemplate.substring(0, interpolateVariableStartIndex));
    return t.binaryExpression(
      '+',
      expression,
      t.identifier(xmlTemplate.substring(interpolateVariableStartIndex + 1, interpolateVariableEndIndex))
    );
  }

  function createXmlTemplateExpression(startExpression, xmlTemplate) {
    return startExpression
      ? t.binaryExpression('+', startExpression, t.stringLiteral(xmlTemplate))
      : t.stringLiteral(xmlTemplate);
  }

  /**
   * Create the new XML expression.
   * @example
   *   var xml = new require("simple4x")(xmlString);
   *
   * @param {expression} xmlString - xml to parse as string expression
   * @returns {callExpression}
   */
  function createNewXmlExpression(xmlString) {
    return t.callExpression(t.newExpression(t.identifier('require'), [t.stringLiteral('simple4x')]), [xmlString]);
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
