import { innerParseClass } from "./parseClassDeclaration";

export default function parseClassExpression(ast, env) {
  return innerParseClass(ast, env, true)
}