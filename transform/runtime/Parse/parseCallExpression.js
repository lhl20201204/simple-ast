import parseAst from "..";
import Environment from "../Environment";
import RuntimeValue, { getUndefinedValue } from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { geStatement, getWindow } from "./parseProgram";


export function setIdentifier(argsRv, paramsAst, env) {
  env.addLet(paramsAst.name, argsRv);
}

export function setAssignmentPattern(argsRv, paramsAst, env) {
  setPattern(parseAst(paramsAst.right, env), paramsAst.left, env)
}

export function setArrayPattern(argsRv, paramsAst, env) {
   _.forEach(paramsAst.elements, (a, i) => {
     setPattern(argsRv.value[i], a, env);
   })
}

export function setObjectPattern(argsRv, paramsAst, env) {
  _.forEach(paramsAst.properties, (op) => {
    const { key, computed } = op;
    let k = key.name;
     if (computed) {
       k = parseRuntimeValue(parseAst(op, env));
     }
    let v = argsRv.value[k]
    env.addLet(k, v)
    // keyil
  })
}

export function setPattern(v, c, childEnv) {
  switch(c.type) {
    case 'Identifier': setIdentifier(v, c, childEnv); break;
    case 'AssignmentPattern': setAssignmentPattern(v, c, childEnv); break;
    case 'ArrayPattern': setArrayPattern(v, c, childEnv); break;
    case 'ObjectPattern': setObjectPattern(v, c, childEnv); break;
  }
}

export default function parseCallExpression(ast, env) {
  const { callee } = ast;
  const args = ast.arguments;
  let _this = getUndefinedValue()
  let fnAst = getUndefinedValue() 
  let name = getUndefinedValue() 
  if (callee.type === 'Identifier') {
    fnAst =  env.get(callee.name).value;
    _this = getWindow()
    name = fnAst.id.name
  } else if (callee.type === 'MemberExpression') {
    _this = parseAst(callee.object, env)
    name = callee.property.name
    if (callee.computed)  {
      name =  parseRuntimeValue(parseAst(callee.property, env))
    }
    fnAst = parseAst(callee, env).value;
  }
  const { params, body, funCb, type } = fnAst;
  if (!['FunctionExpression', 'FunctionDeclaration'].includes(type)) {
    throw new Error(`${name} 不是函数`)
  }
  const tempParams = [...params];
  // console.log(params, body, args);
  const childEnv = new Environment('params_of_function_' + name, env);
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
    setPattern(v, c, childEnv)
  })
  if (restParamsAst) {
    setPattern(new RuntimeValue('arguments',restArgsRV), restParamsAst.argument, childEnv );
  }
  const fnEnv = new Environment('function_' + name, childEnv);
  fnEnv.addConst('this', _this);
  fnEnv.addConst('arguments', new RuntimeValue('arguments', argsRV))
  funCb?.(argsRV);
  let ret = getUndefinedValue()
  const stas = geStatement(body.body);
  for(const s of stas) {
   ret = parseAst(s, fnEnv);
   if (s.type === 'ReturnStatement') {
    break;
   }
  }
  return ret;
}