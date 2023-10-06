import { getNullValue } from "../Environment/RuntimeValue";
import setExpression from "./setExpression";

export default function parseAssignmentPattern(ast, env){
  const { left, right } = ast;
  // console.warn(left, right)
  return setExpression(left, right, env, {});
}