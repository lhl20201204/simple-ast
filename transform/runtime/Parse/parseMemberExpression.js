import parseAst from "..";
import Environment from "../Environment";
import { getUndefinedValue } from "../Environment/RuntimeValue";

export default function parseMemberExpression(ast, env) {
  const object = parseAst(ast.object, env);
  const { property } = ast;
  let key = property.name;
  if (ast.computed) {
    key = parseAst(property, env).value;
  }
  if (object instanceof Environment) {
    return object.get(key)
  }
  if (object.type === 'undefined') {
    throw new Error(`不能获取 undefind 的 ${key}`)
  }
  return object.value[key] ?? getUndefinedValue();
}