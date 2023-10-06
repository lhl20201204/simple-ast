import { stringFormat } from "../../commonApi";
import RuntimeValue from "../Environment/RuntimeValue";
import { createFunction } from "../Environment/RuntimeValueInstance";
import { instanceOfRuntimeValue } from "../Environment/utils";
import { getAstCode } from "../Generate";
import { AST_DICTS, ENV_DICTS, RUNTIME_VALUE_DICTS } from "../constant";

export function innerParseFunction (ast, env, add) {
  const { id } = ast;
  let key = id?.name;

  const { params } = ast;
  const restElementI = _.findIndex(params, c => c.type === 'RestElement');
  if (restElementI > -1) {
    if (restElementI !== params.length - 1) {
      throw new Error('解构必须放在参数的最后一个');
    }
  }
  const value = createFunction({
    [RUNTIME_VALUE_DICTS.symbolAst]: { ...ast, [ENV_DICTS.$hideInHTML]: env.getHideInHtml()},
    [RUNTIME_VALUE_DICTS.symbolEnv]: env,
    [RUNTIME_VALUE_DICTS.symbolName]: id ? getAstCode(id, { text: true }) : (stringFormat(ast[AST_DICTS._DisplayName]) ?? '匿名函数')
  });
  // const FunctionRv = Environment.window.get('Function');
  // console.log(FunctionRv)
  // console.error(
  //   value, 
  //   value.getProto() === FunctionRv.getProtoType(),
  //   instanceOfRuntimeValue(value, FunctionRv)
  // )
  if (add) {
    env.addFunction(key, value);
  }
  // console.error(value)
  return value;
}

export default function parseFunctionDeclaration(ast, env) {
  return innerParseFunction(ast, env, true);
}