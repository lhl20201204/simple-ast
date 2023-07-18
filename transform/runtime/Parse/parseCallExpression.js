import parseAst from "..";
import Environment from "../Environment";
import RuntimeValue, { RuntimeRefValue, getUndefinedValue } from "../Environment/RuntimeValue";
import { getWindowObject } from "../Environment/getWindow";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { getAstCode } from "../Generate";
import { RUNTIME_LITERAL, RUNTIME_VALUE_TYPE } from "../constant";
import { getMemberPropertyKey } from "./parseMemberExpression";
import setPattern from "./setPattern";

const functionType = ['FunctionExpression', 'FunctionDeclaration', 'ArrowFunctionExpression'];

function getCallParams(args, callee, env) {
  let argsRVValue = [];
  if (callee.type === 'CallFunctionExpression') {
    argsRVValue.push(...callee._argsRVValue)
  } else {
    args.forEach(q => {
    const v = parseAst(q , env);
    if (['SpreadElement'].includes(q.type)) {
      argsRVValue.push(...v.value)
    } else {
      argsRVValue.push(v)
    }
  })
  }
  return argsRVValue
}

const logger = false;

export default function parseCallExpression(ast, env) {
  const { callee, arguments: args, optional } = ast;
 
  logger && console.log( getAstCode(ast, { 
    text: true,
    isFunctionEndNotRemark: true, 
    isInCallExpressionCalleer: true,
  }), 
  // [..._.map(getCallParams(args, callee, env),v => parseRuntimeValue(v))],
  )

  let _this = getUndefinedValue()
  let fnAst = undefined; 
  let name = getUndefinedValue() 
  let nativeFnRv;
  let nativeTempArgsRvValue
  if (callee.type === 'Identifier') {
    fnAst =  env.get(callee.name).value;
    _this = getWindowObject()
    name = callee.name
  } else if (callee.type === 'FunctionExpression') {
    fnAst = parseAst(callee, env).value;
    _this = getUndefinedValue()
    name = '自执行函数'
  } else if (callee.type === 'ArrowFunctionExpression') {
    fnAst = parseAst(callee, env).value;
    _this = env.get(RUNTIME_LITERAL.this)
    name = '自执行箭头函数'
  } else if (callee.type === 'RuntimeValue') {
    const rv = callee.value;
    fnAst = rv.value;
    _this = rv.getDefinedEnv().get(RUNTIME_LITERAL.this)
    name = rv.getDefinedName();
    // console.log('RuntimeValue', fnAst, _this, name)
  } else if(callee.type === 'Super'){
    // console.log('执行super时候的环境', env, env.getEnvPath())
    const rv = env.get(RUNTIME_LITERAL.super);
    // console.log(rv)
    fnAst = rv.getMergeCtor().value;
    _this = env.get(RUNTIME_LITERAL.this);
    name = rv.getDefinedName();
    // console.log('super进来调用时的env', fnAst, _this, name, env.getEnvPath());
  } else if (callee.type === 'MemberExpression') {
    _this = parseAst(callee.object, env)
    // if (callee.object.type === 'Super') {
    //   _this =  _this.get
    //
    name = getMemberPropertyKey(callee, env);
    const calleeRv = parseAst(callee, env)
    fnAst = calleeRv.value;
    const { nativeFnCb } = _.get(fnAst, RuntimeValue.symbolAst, {})
    if (nativeFnCb) {
      // console.log('劫持', name , _this);
      nativeTempArgsRvValue = getCallParams(args, callee, env);
      nativeFnRv = nativeFnCb(nativeTempArgsRvValue, { _this, env })
    }
  }
  if (!fnAst) {
    if (optional) {
      return getUndefinedValue()
    }
    console.log(callee, fnAst)
    throw new Error(`${name} 不是可执行函数`)
  }
  const { [RuntimeValue.symbolAst]: {params, body, nativeFnCb, type }, [RuntimeValue.symbolEnv]: fnBeDefinedEnv } = fnAst;

  if (type === 'ArrowFunctionExpression') {
    _this = fnBeDefinedEnv.get(RUNTIME_LITERAL.this);
  }
  if (!functionType.includes(type)) {
    throw new Error(`${name} 不是函数`)
  }
  const tempParams = [...params];
  // console.log(params, body, args);
  const childEnv = new Environment('params_of_function_' + (name || '匿名函数'), fnBeDefinedEnv);
  const argsRVValue = nativeTempArgsRvValue ?? getCallParams(args, callee, env);

  const restI = _.findIndex(tempParams, c => c.type === 'RestElement');
  let restParamsAst = null;
  let restArgsRVValue = []
  if (restI > -1) {
    restParamsAst = tempParams.pop();
    restArgsRVValue = argsRVValue.slice(restI)
  }
  _.forEach(tempParams, (c, i) => {
    let v = getUndefinedValue()
    if (argsRVValue[i]) {
      v = argsRVValue[i];
    }
    setPattern(v, c, childEnv, {})
  })
  if (restParamsAst) {
    setPattern(new RuntimeRefValue(RUNTIME_VALUE_TYPE.arguments,restArgsRVValue), restParamsAst.argument, childEnv , {});
  }
  const fnEnv = new Environment('function_' + (name || '匿名函数')+ '_execute_body', childEnv, { isFunctionEnv: true });
  fnEnv.addConst(RUNTIME_LITERAL.this, _this);
  fnEnv.addConst('arguments', new RuntimeRefValue(RUNTIME_VALUE_TYPE.arguments, argsRVValue));
  const ret = parseAst( body, fnEnv);
  return ret;
}