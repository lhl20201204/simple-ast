import Environment from "../Environment";
import RuntimeValue from "../Environment/RuntimeValue";

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
  const value = new RuntimeValue('function', {
    ast,
    env
  });
  if (key) {
    env.addFunction(key, value);
  }
  return value;
}