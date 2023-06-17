import parseAst from "..";
import Environment from "../Environment";
import RuntimeValue, { getUndefinedValue } from "../Environment/RuntimeValue";
import { getWindowObject } from "../Environment/getWindow";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { geStatement } from "./parseProgram";
import setPattern from "./setPattern";

export default function parseCallExpression(ast, env) {
  const { callee } = ast;
  const args = ast.arguments;
  let _this = getUndefinedValue()
  let fnAst = getUndefinedValue() 
  let name = getUndefinedValue() 
  if (callee.type === 'Identifier') {
    fnAst =  env.get(callee.name).value;
    _this = getWindowObject()
    name = callee.name
  } else if (callee.type === 'MemberExpression') {
    _this = parseAst(callee.object, env)
    name = callee.property.name
    if (callee.computed)  {
      name =  parseRuntimeValue(parseAst(callee.property, env))
    }
    fnAst = parseAst(callee, env).value;
  }
  const { ast: {params, body, funCb, type }, env: fnBeDefinedEnv } = fnAst;
  if (!['FunctionExpression', 'FunctionDeclaration'].includes(type)) {
    throw new Error(`${name} 不是函数`)
  }
  const tempParams = [...params];
  // console.log(params, body, args);
  const childEnv = new Environment('params_of_function_' + name, fnBeDefinedEnv);
  let argsRV = args.map(q => parseAst(q , env));
  const restI = _.findIndex(tempParams, c => c.type === 'RestElement');
  let restParamsAst = null;
  let restArgsRV = new RuntimeValue('array', []);
  if (restI > -1) {
    restParamsAst = tempParams.pop();
    restArgsRV = argsRV.slice(restI)
  }
  _.forEach(tempParams, (c, i) => {
    let v = getUndefinedValue()
    if (argsRV[i]) {
      v = argsRV[i];
    }
    setPattern(v, c, childEnv, {})
  })
  if (restParamsAst) {
    setPattern(new RuntimeValue('arguments',restArgsRV), restParamsAst.argument, childEnv , {});
  }
  const fnEnv = new Environment('function_' + name, childEnv, { isFunctionEnv: true });
  fnEnv.addConst('this', _this);
  fnEnv.addConst('arguments', new RuntimeValue('arguments', argsRV))
  funCb?.(argsRV);
  return parseAst(body, fnEnv);
}