import parseAst from "..";
import RuntimeValue, { getNullValue } from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";

function parseAdd(rv1, rv2) {
  let value = parseRuntimeValue(rv1) + parseRuntimeValue(rv2);
  return new RuntimeValue(typeof value, value)
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

export default function parseBinaryExpression(ast, env) {
  const leftValue = parseAst(ast.left, env);
  const rightValue = parseAst(ast.right, env);
  let value = getNullValue()
  switch(ast.operator) {
    case '+' : return parseAdd(leftValue, rightValue); 
    case '-' : return parseSub(leftValue, rightValue); 
    case '*' : return parseMul(leftValue, rightValue); 
    case '/' : return parseDel(leftValue, rightValue); 
  }
  console.error(ast.operator, '符号未处理')
  return value;
}