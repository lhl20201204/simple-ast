import parseAst from "..";
import { UseRuntimeValueAst, isInstanceOf } from "../../commonApi";
import { getNullValue } from "../Environment/RuntimeValueInstance";

export default function parseUseRuntimeValueExpression(ast, env) {
  if (!isInstanceOf(ast, UseRuntimeValueAst)) {
    throw new Error('ast不是UseRuntimeValueAst类型')
  }
  if (!env.canUseRuntimeValueStack()) {
    throw new Error('不能使用useRuntimeValue')
  }
  const { index, argument } = ast;
  env.setRuntimeValueByStackIndex(index, parseAst(argument, env));
  return getNullValue()
}