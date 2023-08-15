import { isInstanceOf } from "../../commonApi";
import RuntimeValue from "../Environment/RuntimeValue";

export default function parseRuntimeValueExpression(ast, env) {
  let ret = ast.value
  if (_.isFunction(ast.value)) {
    ret = ast.value();
  }

  if (!isInstanceOf(ret , RuntimeValue)) {
    throw new Error('运行错误, RuntimeValueExpression')
  }
  return ret;
}