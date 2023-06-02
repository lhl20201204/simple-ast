import parseAst from "..";

export default function parseReturnStatement(ast, env) {
  return parseAst(ast.argument, env);
}