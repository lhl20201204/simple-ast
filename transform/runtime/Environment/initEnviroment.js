import _ from "lodash";
import parseAst from "..";
import { PROPERTY_DESCRIPTOR_DICTS, RUNTIME_LITERAL } from "../constant";
import RuntimeValue from "./RuntimeValue";
import { _ObjectAst, _ObjectCreateAst } from "./Native/Object";
import { defalultTransformConfig, transformInnerAst } from "./WrapAst";
import { _reflectAst } from "./Native/Reflect";
import { _FunctionBindAst } from "./Native/Function";
import parseRuntimeValue from "./parseRuntimeValue";
import PropertyDescriptor from "./PropertyDescriptor";
import { _ErrorAst } from "./Native/Error";
import { createArray, createNumber, createString, getFalseV, getFunctionClassRv, getGenerateFn, getNullValue, getObjectPrototypeRv, getReflectDefinedPropertyV, getTrueV, getUndefinedValue, runFunctionRuntimeValueInGlobalThis } from "./RuntimeValueInstance";
import { getWindowEnv, getWindowObjectRv } from "./getWindow";
import { createSimplePropertyDescriptor, isFunctionRuntimeValue } from "./utils";
import { getConsoleV } from "./NativeRuntimeValue/console";
import { getNumberFunctionV } from "./NativeRuntimeValue/number";
import { getStringFunctionV } from "./NativeRuntimeValue/string";
import { getMathRv } from "./NativeRuntimeValue/Math";
import { getSymbolV } from "./NativeRuntimeValue/symbol";

export function initEnviroment() {
  const windowRv = getWindowObjectRv()
  const globalEnv = getWindowEnv()
  const ObjectPrototypeV = getObjectPrototypeRv()
  const FunctionClassV = getFunctionClassRv()
  const generateFn = getGenerateFn()
  const consoleV = getConsoleV()
  globalEnv.parent = null;
  globalEnv.children = [];
  globalEnv.map = new Map()
  globalEnv.keyMap = new Map()
  globalEnv.constMap = new Map();
  globalEnv.placeholderMap = new Map();
  globalEnv.setHideInHtml(true)
  RuntimeValue.isTransforming = true;
  _.forEach([
    [RUNTIME_LITERAL.null, getNullValue(), 'const'],
    [RUNTIME_LITERAL.undefined, getUndefinedValue(), 'let'],
    [RUNTIME_LITERAL.true, getTrueV(), 'const'],
    [RUNTIME_LITERAL.false, getFalseV(), 'const'],
  ], ([key, value, kind]) => {
    globalEnv['add' + _.upperFirst(kind)](key, value)
  })
  // globalEnv.addLet('Object', ObjectClassV);
  globalEnv.addFunction('Function', FunctionClassV);

  parseAst(_ObjectAst, globalEnv);
  const objectRv = windowRv.get('Object')
  objectRv.setProtoType(ObjectPrototypeV);
  ObjectPrototypeV.set('constructor', objectRv, createSimplePropertyDescriptor({
    value: objectRv,
    [PROPERTY_DESCRIPTOR_DICTS.writable]: getFalseV()
  }))
  
  globalEnv.addVar(RUNTIME_LITERAL.NaN, createNumber(NaN));

  console.log(globalEnv);

  globalEnv.addLet('console', consoleV);

  globalEnv.addLet('window', windowRv);

  globalEnv.addFunction('setTimeout', generateFn('setTimeout', ([fnRv, tR]) => {
    if (!isFunctionRuntimeValue(fnRv)) {
      throw new Error('setTimeout需要接受一个函数')
    }
   return createNumber(setTimeout(()=> runFunctionRuntimeValueInGlobalThis(fnRv, windowRv), parseRuntimeValue(tR) ?? 0));
  }))

  globalEnv.addFunction('clearTimeout', generateFn('clearTimeout', ([tR]) => {
     clearTimeout(parseRuntimeValue(tR) ?? 0)
  }))

  globalEnv.addFunction('setInterval', generateFn('setInterval', ([fnRv, tR]) => {
    if (!isFunctionRuntimeValue(fnRv)) {
      throw new Error('setInterval需要接受一个函数')
    }
   return createNumber(
    setInterval(()=> runFunctionRuntimeValueInGlobalThis(fnRv, windowRv), parseRuntimeValue(tR) ?? 0)
   );
  }))

  globalEnv.addFunction('clearInterval', generateFn('clearInterval', ([tR]) => {
     clearInterval(parseRuntimeValue(tR) ?? 0)
  }))

  globalEnv.addFunction('Symbol', getSymbolV());
  globalEnv.addFunction('Number', getNumberFunctionV());
  globalEnv.addFunction('String', getStringFunctionV());
  globalEnv.addFunction('Math', getMathRv())
  globalEnv.addConst(RUNTIME_LITERAL.this, windowRv);

  // console.error( '开始')

  const runInnerAst = (arr) => _.map(arr, ast => transformInnerAst(ast, {
    wrapRuntimeValue: false,
    transformConfig: defalultTransformConfig,
    parent: null
  })).forEach((x, i) => {
    // console.error('-----', x)
    parseAst(x, globalEnv)
  });

  runInnerAst([
    _reflectAst,
    // _FunctionApplyAst, // 这俩种方式会导致globalEnv带有一个变量。
    // _FunctionCallAst,
    // _FunctionBindAst,
  ])
  windowRv.get('Reflect').setWithDescriptor('defineProperty', getReflectDefinedPropertyV())
  runInnerAst([
    // _reflectAst,
    // _FunctionApplyAst, // 这俩种方式会导致globalEnv带有一个变量。
    // _FunctionCallAst,
    _FunctionBindAst,
  ])
  windowRv.get('Object').setWithDescriptor('keys', generateFn('Object$keys', ([objRv]) => {
    // console.error(objRv.keys(), _.filter(objRv.keys(), x => objRv.isAttrEnumerable(x)))
    // console.error(objRv.keys())
    return createArray(_.map(_.filter(objRv.keys(), x => objRv.isAttrEnumerable(x)), createString))
  }))

  // 后续直接挂runtimeValue里，先暂时这样
  
  windowRv.get('Reflect').setWithDescriptor('getOwnPropertyDescriptor', generateFn('Reflect$getOwnPropertyDescriptor', (
    [
      objRv,
      attrRv,
    ],
  ) => {
    const oldDescripor = objRv.getOwnPropertyDescriptor(
      parseRuntimeValue(attrRv)
    );

    return oldDescripor ? oldDescripor.toRuntimeValue() : getUndefinedValue()
  }))
  parseAst(_ObjectCreateAst, globalEnv);
  runInnerAst([
    _ErrorAst,
  ])

  RuntimeValue.isTransforming = false;
  globalEnv.setHideInHtml(false)
}