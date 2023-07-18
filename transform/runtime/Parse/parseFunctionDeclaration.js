import Environment, { createFunction } from "../Environment";
import RuntimeValue from "../Environment/RuntimeValue";
import { getAstCode } from "../Generate";

export default function parseFunctionDeclaration(ast, env) {
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
    [RuntimeValue.symbolAst]: ast,
    [RuntimeValue.symbolEnv]: env,
    [RuntimeValue.symbolName]: id ? getAstCode(id, { text: true }) : (ast._fnName ?? '匿名函数')
  });
  if (key) {
    env.addFunction(key, value);
  }
  return value;
}