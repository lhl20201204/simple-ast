import { RuntimeValueAst, isInstanceOf } from "../../commonApi";
import RuntimeValue from "../Environment/RuntimeValue";

export default function parseRuntimeValueExpression(ast, env) {
  if (!isInstanceOf(ast, RuntimeValueAst)) {
    throw new Error('ast不是RuntimeValueAst类型')
  }

  let ret = ast.value
  if (_.isFunction(ast.value)) {
    ret = ast.value(env);
  }

  if (!isInstanceOf(ret , RuntimeValue)) {
    throw new Error('运行错误, RuntimeValueExpression')
  }
  return ret;
}