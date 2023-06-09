import parseAst from "..";
import RuntimeValue, { getNullValue } from "../Environment/RuntimeValue";
import getEqualValue from "../Environment/getEqualValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";

function parseAdd(rv1, rv2) {
  let value = parseRuntimeValue(rv1) + parseRuntimeValue(rv2);
  return new RuntimeValue(typeof value, value);
}

function parseSub(rv1, rv2) {
  let value = parseRuntimeValue(rv1) - parseRuntimeValue(rv2);
  return new RuntimeValue(typeof value, value)
}

function parseMul(rv1, rv2) {
  let value = parseRuntimeValue(rv1) * parseRuntimeValue(rv2);
  return new RuntimeValue(typeof value, value)
}

function parseDel(rv1, rv2) {
  let value = parseRuntimeValue(rv1) / parseRuntimeValue(rv2);
  return new RuntimeValue(typeof value, value)
}

function parseStrictEqual(rv1, rv2) {
  let value = getEqualValue(rv1) === getEqualValue(rv2);
  return new RuntimeValue(typeof value, value)
}

function parseEqual(rv1, rv2) {
  let value = getEqualValue(rv1) == getEqualValue(rv2);
  return new RuntimeValue(typeof value, value)
}

function parseGreat(rv1, rv2) {
  let value = parseRuntimeValue(rv1) > parseRuntimeValue(rv2);
  return new RuntimeValue(typeof value, value)
}

function parseLess(rv1, rv2) {
  let value = parseRuntimeValue(rv1) < parseRuntimeValue(rv2);
  return new RuntimeValue(typeof value, value)
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
    case '==': return parseEqual(leftValue, rightValue);
    case '>': return parseGreat(leftValue, rightValue);
    case '<': return parseLess(leftValue, rightValue);
  }
  console.error(ast.operator, '符号未处理')
  return value;
}