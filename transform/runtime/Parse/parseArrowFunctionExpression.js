import _ from "lodash";
import RuntimeValue, { RuntimeRefValue } from "../Environment/RuntimeValue";
import Environment from "../Environment";
import { RUNTIME_VALUE_DICTS, RUNTIME_VALUE_TYPE } from "../constant";
import { createArrowFunction, getFunctionPrototypeRv } from "../Environment/RuntimeValueInstance";

export default function parseArrowFunctionExpression(ast, env) {
  const { params, key } = ast;
  const restElementI = _.findIndex(params, c => c.type === 'RestElement');
  if (restElementI > -1) {
    if (restElementI !== params.length - 1) {
      throw new Error('解构必须放在函数参数的最后一个');
    }
  }
  
  const value = createArrowFunction(ast, env);

  if (key) {
    env.addFunction(key, value);
  }
  return value;
}