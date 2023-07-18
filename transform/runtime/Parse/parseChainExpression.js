import parseAst from "..";

export default function parseChainExpression(ast, env) {
  return parseAst(ast.expression, env);
}