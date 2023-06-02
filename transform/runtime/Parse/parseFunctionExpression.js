import parseFunctionDeclaration from "./parseFunctionDeclaration";

export default function parseFunctionExpression(ast, env) {
  return parseFunctionDeclaration(ast, env);
}