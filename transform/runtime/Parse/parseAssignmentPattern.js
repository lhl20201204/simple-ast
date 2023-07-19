import { getNullValue } from "../Environment/RuntimeValue";
import setExpression from "./setExpression";

export default function parseAssignmentPattern(ast, env){
  const { left, right } = ast;
  return setExpression(left, right, env, {});
}