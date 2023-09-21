import parseAst from "..";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";

export default function parseReturnStatement(ast, env) {
  const value = ast.argument ? parseAst(ast.argument, env) : getUndefinedValue();
  const target = env.findFunctionEnv()
  if (!target) {
    throw new Error('当前不在函数内无法return')
  }
  env.setReturnValue(value);
  env.setCurrentEnvReturnValue(value)
  return value
}