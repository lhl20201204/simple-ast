import parseAst from "..";
import setExpression from "./setExpression";

export default function parseAssignmentExpression(ast, env) {
  const { left, right } = ast;
  // const value = parseAst(right, env); // { a: 1, b: [6]}
  // setExpression(value, left, env)
  // console.log(env, value);
  // todo
  return setExpression(left, right, env);
}