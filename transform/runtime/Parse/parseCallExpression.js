import parseAst from "..";
import { isInstanceOf } from "../../commonApi";
import Environment from "../Environment";
import RuntimeValue, { RuntimeRefValue } from "../Environment/RuntimeValue";
import { createObject, getUndefinedValue } from "../Environment/RuntimeValueInstance";
import { getWindowObjectRv } from "../Environment/getWindow";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { isFunctionRuntimeValue } from "../Environment/utils";
import generateCode, { getAstCode } from "../Generate";
import { AST_DICTS, ENV_DICTS, RUNTIME_LITERAL, RUNTIME_VALUE_DICTS, RUNTIME_VALUE_TYPE } from "../constant";
import { getMemberPropertyKey } from "./parseMemberExpression";
import { isYieldError } from "./parseYieldExpression";
import setPattern from "./setPattern";

const functionType = ['FunctionExpression', 'FunctionDeclaration', 'ArrowFunctionExpression'];

function getCallParams(args, callee, env) {
  let argsRVValue = [];
  if (callee.type === 'CallFunctionExpression') {
    argsRVValue.push(...callee._argsRVValue)
  } else {
    args.forEach(q => {
      const v = parseAst(q, env);
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

  logger && console.log(getAstCode(ast, {
    text: true,
    isFunctionEndNotRemark: true,
    isInCallExpressionCalleer: true,
  }),
    // [..._.map(getCallParams(args, callee, env),v => parseRuntimeValue(v))],
  )

  let _this = getUndefinedValue()
  let fnAst = undefined;
  let name = getUndefinedValue()
  let nativeFnRetRv;
  let nativeTempArgsRvValue
  if (callee.type === 'Identifier') {
    const fnRv= env.get(callee.name);
    if (!isFunctionRuntimeValue(fnRv)) {
      throw new Error(`${generateCode(callee)}不是可执行函数`)
    }
    fnAst = fnRv.value;
    _this = fnRv?.getDefinedEnv?.()?.isInUseStrict() ? getUndefinedValue() : getWindowObjectRv()
    name = callee.name

    const { nativeFnCb } = _.get(fnAst, RUNTIME_VALUE_DICTS.symbolAst, {})
    if (nativeFnCb) {

      nativeTempArgsRvValue = getCallParams(args, callee, env);
      // console.log('劫持', name , _this, nativeTempArgsRvValue);
      nativeFnRetRv = nativeFnCb(nativeTempArgsRvValue, { _this, env })
      if (nativeFnRetRv && !isInstanceOf(nativeFnRetRv, RuntimeValue)) {
        throw new Error('内置函数必须返回runtimeValue')
      }
    }
  } else if (callee.type === 'FunctionExpression') {
    fnAst = parseAst(callee, env).value;
    _this = getUndefinedValue()
    name = '自执行函数'
  } else if (callee.type === 'ArrowFunctionExpression') {
    fnAst = parseAst(callee, env).value;
    _this = env.get(RUNTIME_LITERAL.this)
    name = '自执行箭头函数'
  } else if (callee.type === AST_DICTS.RuntimeValue) {
    const rv = parseAst(callee, env);
    if (!isFunctionRuntimeValue(rv)) {
      throw new Error(`${generateCode(callee)}不是可执行函数`)
    }
    fnAst = rv.value;
    _this = env.get(RUNTIME_LITERAL.this)
    name = rv.getDefinedName();
    const { nativeFnCb } = _.get(fnAst, RUNTIME_VALUE_DICTS.symbolAst, {})
    if (nativeFnCb) {

      nativeTempArgsRvValue = getCallParams(args, callee, env);
      // console.log('劫持', name , _this, nativeTempArgsRvValue);
      nativeFnRetRv = nativeFnCb(nativeTempArgsRvValue, { _this, env })
      if (nativeFnRetRv && !isInstanceOf(nativeFnRetRv, RuntimeValue)) {
        throw new Error('内置函数必须返回runtimeValue')
      }
    }
    // console.error('进来');
    // console.log('RuntimeValue', fnAst, _this, name)
  } else if (callee.type === 'Super') {
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
    if (!isFunctionRuntimeValue(calleeRv)) {
      throw new Error(`${generateCode(callee)}不是可执行函数`)
    }
    fnAst = calleeRv.value;
    const { nativeFnCb } = _.get(fnAst, RUNTIME_VALUE_DICTS.symbolAst, {})
    if (nativeFnCb) {

      nativeTempArgsRvValue = getCallParams(args, callee, env);
      // console.log('劫持', name , _this, nativeTempArgsRvValue);
      nativeFnRetRv = nativeFnCb(nativeTempArgsRvValue, { _this, env })
      if (nativeFnRetRv && !isInstanceOf(nativeFnRetRv, RuntimeValue)) {
        throw new Error('内置函数必须返回runtimeValue')
      }
    }
  } else if(callee.type === 'CallExpression') {
    const fnRv= parseAst(callee, env);
    if (!isFunctionRuntimeValue(fnRv)) {
      throw new Error(`${generateCode(callee.callee)}函数返回不是函数`)
    }
    fnAst = fnRv.value;
    _this = fnRv.getDefinedEnv().isInUseStrict() ? getUndefinedValue() : getWindowObjectRv()
    name = generateCode(callee.callee)
  }

  if (!fnAst) {
    if (optional) {
      return getUndefinedValue()
    }
    console.log(callee, fnAst, name, env)
    throw new Error(`${name} 不是可执行函数`)
  }

  const { [RUNTIME_VALUE_DICTS.symbolAst]: { params, body, generator, [ENV_DICTS.$hideInHTML]: hideInHTML , type }, [RUNTIME_VALUE_DICTS.symbolEnv]: fnBeDefinedEnv } = fnAst;

  const isGenerator = !!generator;
  const isArrowFunctionType = type === 'ArrowFunctionExpression';
  if (isArrowFunctionType) {
    _this = fnBeDefinedEnv.get(RUNTIME_LITERAL.this);
  }
  if (!functionType.includes(type)) {
    // console.log(type);
    throw new Error(`${name} 不是函数`)
  }
  const tempParams = [...params];
  // console.log(params, body, args);
  const childEnv = new Environment('params_of_function_' + (name || '匿名函数') + '_execute_body', fnBeDefinedEnv, {
    [ENV_DICTS.$hideInHTML]: hideInHTML,
    [ENV_DICTS.isFunctionEnv]: true,
    [ENV_DICTS.isGeneratorFnRuntimeValueType]: isGenerator,
    [ENV_DICTS.isOpenRuntimeValueStack]: isArrowFunctionType && callee.type === 'ArrowFunctionExpression',
  });

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
    setPattern(v, c, childEnv, { kind: 'params'})
  })
  if (restParamsAst) {
    setPattern(new RuntimeRefValue(RUNTIME_VALUE_TYPE.arguments, restArgsRVValue), restParamsAst.argument, childEnv, { kind: 'params' });
  }
  // const fnEnv = new Environment('function_' + (name || '匿名函数') + '_execute_body', childEnv, { 
  //   [ENV_DICTS.isFunctionEnv]: true,
  //   [ENV_DICTS.isGeneratorFnRuntimeValueType]: isGenerator,
  //   [ENV_DICTS.isOpenRuntimeValueStack]: isArrowFunctionType && callee.type === 'ArrowFunctionExpression',
  //  });
  childEnv.addConst(RUNTIME_LITERAL.this, _this);
  if (!isArrowFunctionType) {
    childEnv.addConst(RUNTIME_LITERAL.arguments, new RuntimeRefValue(RUNTIME_VALUE_TYPE.arguments, argsRVValue));
  }
  const ret = parseAst(body, childEnv);
  return nativeFnRetRv ?? ret;
}