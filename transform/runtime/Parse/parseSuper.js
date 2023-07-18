import { RUNTIME_LITERAL } from "../constant";

export default function parseSuper(ast, env) {
  return env.get(RUNTIME_LITERAL.super);
}