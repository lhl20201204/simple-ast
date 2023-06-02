import parseAst from "..";

export default function parseExpressionStatement(ast, env) {
  return parseAst(ast.expression, env);
}