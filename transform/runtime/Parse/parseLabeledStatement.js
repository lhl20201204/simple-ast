import { innerParseWhileStatement } from "./parseWhileStatement";

export default function parseLabeledStatement(ast, env) {
  return innerParseWhileStatement(ast.body, env, ast.label.name)
}