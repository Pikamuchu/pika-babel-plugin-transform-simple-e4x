'use strict';

module.exports = function(t) {
  var CLEAN_XML_SPACES_REGEX = /(\r?\n)\s+/g;
  var CLEAN_XML_ATTRIBUTES_VALUES_REGEX = /\s*=\s*'?"?\{(\w*)\}'?"?/g;
  var CLEAN_XML_ATTRIBUTES_VALUES_REPLACE = '="{$1}"';
  var MAX_INTERPOLATE_VARIABLE_ITERATIONS = 10000;

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
      var interpolateExpressionEndIndex = calculateInterpolateExpressionEndIndex(
        xmlTemplate,
        interpolateExpressionStartIndex
      );
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
   * Check parent path and add the built expression to it.
   * @param {path} path - Babel path
   * @returns {path} parentPath
   */
  function addExpressionToPath(path, expression) {
    var resultIdentifier = getResultIdentifier(path);
    var parentPath = path && path.parentPath;
    if (!parentPath) {
      path.replaceWith(expression);
    } else if (t.isAssignmentExpression(parentPath)) {
      parentPath.replaceWith(expression);
    } else if (t.isVariableDeclarator(parentPath)) {
      parentPath.parentPath.replaceWith(
        t.variableDeclaration('var', [t.variableDeclarator(t.identifier(resultIdentifier.name), expression)])
      );
    } else if (t.isBinaryExpression(parentPath)) {
      parentPath.replaceWith(
        t.callExpression(t.memberExpression(parentPath.node.left, t.identifier('appendChild')), [expression])
      );
    } else {
      path.replaceWith(expression);
    }
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
      t.variableDeclarator(
        t.identifier('XML'),
        t.callExpression(t.identifier('require'), [t.stringLiteral('simple4x')])
      )
    ]);
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
      createInterpolatedExpression(
        xmlTemplate.substring(interpolateExpressionStartIndex + 1, interpolateExpressionEndIndex)
      )
    );
  }

  function createXmlTemplateExpression(startExpression, xmlTemplate) {
    return startExpression
      ? t.binaryExpression('+', startExpression, t.stringLiteral(xmlTemplate))
      : t.stringLiteral(xmlTemplate);
  }

  function createInterpolatedExpression(interpolatedString) {
    return t.identifier('(' + interpolatedString + ')');
  }

  function getResultIdentifier(path) {
    var result;
    var parentNode = path && path.parentPath && path.parentPath.node;
    if (!parentNode) {
      result = t.identifier('nullParentNode');
    } else if (t.isAssignmentExpression(parentNode)) {
      result = parentNode.left;
    } else if (t.isVariableDeclarator(parentNode)) {
      result = parentNode.id;
    } else {
      result = t.identifier('identifierNotFound');
    }
    return result;
  }

  return {
    buildXmlString: buildXmlString,
    createNewXmlExpression: createNewXmlExpression,
    addExpressionToPath: addExpressionToPath,
    createRequireXmlExpression: createRequireXmlExpression
  };
};
