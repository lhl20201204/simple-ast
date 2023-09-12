import parseAst from "..";
import { getNullValue } from "../Environment/RuntimeValueInstance";
import parseRuntimeValue from "../Environment/parseRuntimeValue";

function parseAnd(ast1, ast2, env) {
  let value = (parseAst(ast1, env))
  // 第一个为false，提前返回
  if (!parseRuntimeValue(value)) {
    // console.error('判断', ast1)
    return value;
  }
  
  value = parseAst(ast2, env)
  return value
}

function parseOr(ast1, ast2, env) {
  
  let value = (parseAst(ast1, env))
  // 第一个为true，提前返回
  if (parseRuntimeValue(value)) {
    return value;
  }
  value = parseAst(ast2, env)
  return value
}

function parseOr2(ast1, ast2, env) {
  
  let value = (parseAst(ast1, env))
  // 第一个不为Null， undefined，提前返回
  if (!_.isNil(parseRuntimeValue(value))) {
    return value;
  }
  value = parseAst(ast2, env)
  return value
}

export default function parseLogicalExpression(ast, env) {
  const { left, operator, right } = ast;
  let value = getNullValue()
  switch(operator) {
    case '&&' : return parseAnd(left, right, env); 
    case '||' : return parseOr(left, right, env); 
    case '??' : return parseOr2(left, right, env); 
  }
  console.error(ast.operator, '符号未处理')
  return value;
}