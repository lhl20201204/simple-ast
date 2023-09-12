import { GetRuntimeValueAst, isInstanceOf } from "../../commonApi";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance"

export default function parseGetRuntimeValueExpression(ast, env) {
  if (!isInstanceOf(ast, GetRuntimeValueAst)) {
    throw new Error('ast不是GetRuntimeValueAst类型')
  }
  const ret =  env.getRuntimeValueByStackIndex(ast.index)
  
  return ret ?? getUndefinedValue();
}