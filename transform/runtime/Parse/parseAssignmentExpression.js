import parseAst from "..";
import { setPattern } from "./parseCallExpression";

export default function parseAssignmentExpression(ast, env) {
  const { left, right } = ast;
  const value = parseAst(right, env);
  setPattern(value, left, env)
  console.log(env, value);
  // todo
  return value;
}