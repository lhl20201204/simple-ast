import parseAst from "..";
import { instanceOfRuntimeValue } from "../Environment/utils";
import RuntimeValue from "../Environment/RuntimeValue";
import getEqualValue from "../Environment/getEqualValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { JS_TO_RUNTIME_VALUE_TYPE } from "../constant";
import { getFalseV, getNullValue, getTrueV } from "../Environment/RuntimeValueInstance";

function parseAdd(rv1, rv2) {
  let value = parseRuntimeValue(rv1) + parseRuntimeValue(rv2);
  return new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE( value), value);
}

function parseSub(rv1, rv2) {
  let value = parseRuntimeValue(rv1) - parseRuntimeValue(rv2);
  return new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE( value), value)
}

function parseMul(rv1, rv2) {
  let value = parseRuntimeValue(rv1) * parseRuntimeValue(rv2);
  return new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE( value), value)
}

function parsePower(rv1, rv2) {
  let value = parseRuntimeValue(rv1) ** parseRuntimeValue(rv2);
  return new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE( value), value)
}

function parseDel(rv1, rv2) {
  let value = parseRuntimeValue(rv1) / parseRuntimeValue(rv2);
  return new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE( value), value)
}

function parseStrictEqual(rv1, rv2) {
  let value = getEqualValue(rv1) === getEqualValue(rv2);
  // if (value) {
  //   console.error(rv1, rv2);
  // }
  return value ? getTrueV() : getFalseV()
}

function parseStrictNotEqual(rv1, rv2) {
  return parseStrictEqual(rv1, rv2) === getTrueV() ? getFalseV() : getTrueV()
}

function parseEqual(rv1, rv2) {
  return parseRuntimeValue(rv1) == parseRuntimeValue(rv2) ? getTrueV() : getFalseV()
}

function parseNotEqual(rv1, rv2) {
  return parseEqual(rv1, rv2) === getTrueV() ? getFalseV() : getTrueV()
}

function parseGreat(rv1, rv2) {
  let value = parseRuntimeValue(rv1) > parseRuntimeValue(rv2);
  return new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE( value), value)
}

function parseGreatEq(rv1, rv2) {
  let value = parseRuntimeValue(rv1) >= parseRuntimeValue(rv2);
  return new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE( value), value)
}

function parseLess(rv1, rv2) {
  let value = parseRuntimeValue(rv1) < parseRuntimeValue(rv2);
  return new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE( value), value)
}

function parseLessEq(rv1, rv2) {
  let value = parseRuntimeValue(rv1) <= parseRuntimeValue(rv2);
  return new RuntimeValue(JS_TO_RUNTIME_VALUE_TYPE( value), value)
}

export default function parseBinaryExpression(ast, env) {
  const leftValue = parseAst(ast.left, env);
  const rightValue = parseAst(ast.right, env);
  let value = getNullValue()
  switch(ast.operator) {
    case '+' : return parseAdd(leftValue, rightValue); 
    case '-' : return parseSub(leftValue, rightValue); 
    case '*' : return parseMul(leftValue, rightValue); 
    case '/' : return parseDel(leftValue, rightValue);
    case '===': return parseStrictEqual(leftValue, rightValue);
    case '!==': return parseStrictNotEqual(leftValue, rightValue);
    case '==': return parseEqual(leftValue, rightValue);
    case '!=': return parseNotEqual(leftValue, rightValue);
    case '>': return parseGreat(leftValue, rightValue);
    case '<': return parseLess(leftValue, rightValue);
    case '>=': return parseGreatEq(leftValue, rightValue);
    case '<=': return parseLessEq(leftValue, rightValue);
    case '**':  return parsePower(leftValue, rightValue);
    case 'instanceof': return instanceOfRuntimeValue(leftValue, rightValue)
  }
  console.error(ast.operator, '符号未处理')
  return value;
}