import generateCode from "../Generate";
import parseFunctionDeclaration, { innerParseFunction } from "./parseFunctionDeclaration";

export default function parseFunctionExpression(ast, env) {
  return innerParseFunction(ast, env, false);
}