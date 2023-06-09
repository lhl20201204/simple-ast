import parseAst from "..";

export default function parseReturnStatement(ast, env) {
  const value = parseAst(ast.argument, env);
  const target = env.findFunctionEnv()
  if (!target) {
    throw new Error('当前不在函数内无法return')
  }
  env.setReturnValue(value);
  return value
}