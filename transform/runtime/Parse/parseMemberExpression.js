import parseAst from "..";
import { isUndefinedRuntimeValue } from "../Environment/utils";
import { getUndefinedValue } from "../Environment/RuntimeValue";
import { getKeyString } from "./parseObjectExpression";
import generateCode from "../Generate";
import { DEBUGGER_DICTS } from "../constant";

export function getMemberPropertyKey(ast, env) {
  if (ast.type !== 'MemberExpression') {
    throw new Error('ast 必须是MemberExpression')
  }
  const { property, computed } = ast;
  return getKeyString(property, computed, env);
}

export default function parseMemberExpression(ast, env) {
  let object = parseAst(ast.object, env);
  const { optional } = ast;
  let key = getMemberPropertyKey(ast, env)
  // console.log(ast.object,)
  // console.error(ast.object, object, key);
  // console.error('开始判断')
  // console.log(ast.object,object);
  if (isUndefinedRuntimeValue(object)) {
    // console.error('-----jinlai')
    if (optional) {
      return getUndefinedValue()
    }
    console.error(ast, key)
    throw new Error(`不能获取 undefind 的 ${key}`)
  }
  // console.error('return',  object.get(key))
  // console.log(ast, env, generateCode(ast, { [DEBUGGER_DICTS.isTextMode]: true}), object, key);
  return object.get(key);
}