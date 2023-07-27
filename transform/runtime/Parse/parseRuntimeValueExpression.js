import { isInstanceOf } from "../../commonApi";
import RuntimeValue from "../Environment/RuntimeValue";

export default function parseRuntimeValueExpression(ast, env) {
  if (!isInstanceOf(ast.value , RuntimeValue)) {
    throw new Error('运行错误, RuntimeValueExpression')
  }
  return ast.value;
}