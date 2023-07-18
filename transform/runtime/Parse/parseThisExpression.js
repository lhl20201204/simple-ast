import { RUNTIME_LITERAL } from "../constant";

export default function parseThisExpression(ast, env) {
  return env.get(RUNTIME_LITERAL.this);
}