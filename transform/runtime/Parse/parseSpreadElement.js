import parseAst from "..";

export default function parseSpreadElement(ast, env) {
  return parseAst(ast.argument, env);
}