import parseAst from "..";
import { isUndefinedRuntimeValue } from "../Environment/utils";
import { getUndefinedValue } from "../Environment/RuntimeValue";
import { getKeyString } from "./parseObjectExpression";

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

  if (isUndefinedRuntimeValue(object)) {
    if (optional) {
      return getUndefinedValue()
    }
    throw new Error(`不能获取 undefind 的 ${key}`)
  }

  return object.get(key);
}