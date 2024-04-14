import parseAst from "..";

export default function parseWithStatement(ast, env) {
  env.pushCurrentWithRuntimeValue(parseAst(ast.object, env));
  parseAst(ast.body, env);
  env.popCurrentWithRuntimeValue();
}