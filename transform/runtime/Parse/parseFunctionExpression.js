import parseFunctionDeclaration, { handleFunction } from "./parseFunctionDeclaration";

export default function parseFunctionExpression(ast, env) {
  // console.error('parseFunctionExpression')
  return handleFunction(ast, env, false);
}