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
import { createRuntimeValueAst, createSimplePropertyDescriptor, isFunctionRuntimeValue, withWrapAsync } from "./utils";
import { getConsoleV } from "./NativeRuntimeValue/console";
import { getNumberFunctionV } from "./NativeRuntimeValue/number";
import { getStringFunctionV } from "./NativeRuntimeValue/string";
import { getMathRv } from "./NativeRuntimeValue/Math";
import { getSymbolV } from "./NativeRuntimeValue/symbol";
import { getArrayProtoTypeV, getArrayRv } from "./NativeRuntimeValue/array";
import { _ArraySymbolIteratorAst, _arrayFilterAst, _arrayIncludesAst, _arrayIndexOfAst, _arrayMapAst, _arrayReduceAst, _arraySliceAst } from "./Native/Array";
import { isInstanceOf, isJsSymbolType, isSymbolType } from "../../commonApi";
import { getPromiseRv } from "./NativeRuntimeValue/promise";
import { getBooleanFunctionRv } from "./NativeRuntimeValue/boolean";
import { _SetClassAst } from "./Native/Set";

export function initEnviroment() {
  const windowRv = getWindowObjectRv()
  const globalEnv = getWindowEnv()
  const ObjectPrototypeV = getObjectPrototypeRv()
  const FunctionClassV = getFunctionClassRv()
  const generateFn = getGenerateFn()
  const consoleV = getConsoleV(true)
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

  // console.log(globalEnv);

  globalEnv.addLet('console', consoleV);

  globalEnv.addLet('window', windowRv);


  globalEnv.addFunction('setTimeout', generateFn('setTimeout', ([fnRv, tR]) => {
    if (!isFunctionRuntimeValue(fnRv)) {
      throw new Error('setTimeout需要接受一个函数')
    }
   return createNumber(setTimeout(()=> withWrapAsync(createRuntimeValueAst(fnRv, 'setTimeout_callback'), globalEnv), parseRuntimeValue(tR) ?? 0));
  }))

  globalEnv.addFunction('clearTimeout', generateFn('clearTimeout', ([tR]) => {
     clearTimeout(parseRuntimeValue(tR) ?? 0)
  }))

  globalEnv.addFunction('setInterval', generateFn('setInterval', ([fnRv, tR]) => {
    if (!isFunctionRuntimeValue(fnRv)) {
      throw new Error('setInterval需要接受一个函数')
    }
   return createNumber(
    setInterval(()=> withWrapAsync(createRuntimeValueAst(fnRv, 'setInterval_callback'), globalEnv), parseRuntimeValue(tR) ?? 0)
   );
  }))

  globalEnv.addFunction('queueMicrotask', generateFn('queueMicrotask', ([fnRv]) => {
    if (!isFunctionRuntimeValue(fnRv)) {
      throw new Error('queueMicrotask需要接受一个函数')
    }
   return queueMicrotask(()=> withWrapAsync(createRuntimeValueAst(fnRv, 'queueMicrotask_callback'), globalEnv))
  }))

  globalEnv.addFunction('clearInterval', generateFn('clearInterval', ([tR]) => {
     clearInterval(parseRuntimeValue(tR) ?? 0)
  }))
  globalEnv.addFunction('Symbol', getSymbolV());
  globalEnv.addFunction('Boolean', getBooleanFunctionRv());
  globalEnv.addFunction('Array', getArrayRv());
  [
    _ArraySymbolIteratorAst,
    _arrayMapAst,
    _arrayFilterAst,
    _arrayReduceAst,
    _arrayIndexOfAst,
    _arraySliceAst,
    _arrayIncludesAst,
  ].forEach((x) => parseAst(x, globalEnv))
  globalEnv.addClass('Promise', getPromiseRv());
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
  parseAst(_SetClassAst, globalEnv)
  const arrProtov = getArrayProtoTypeV()
  arrProtov.propertyDescriptors.delete('length');
  parseAst({
    "type": "ExpressionStatement",
    "start": 1,
    "end": 132,
    "expression": {
      "type": "CallExpression",
      "start": 1,
      "end": 132,
      "callee": createRuntimeValueAst(
        getReflectDefinedPropertyV()
        , 'Reflect$defineProperty'),
      "arguments": [
        createRuntimeValueAst(getArrayProtoTypeV(), 'Array$prototypr'),
        {
          "type": "Literal",
          "start": 41,
          "end": 49,
          "value": "length",
          "raw": "'length'"
        },
        {
          "type": "ObjectExpression",
          "start": 51,
          "end": 131,
          "properties": [
            {
              "type": "Property",
              "start": 55,
              "end": 72,
              "method": true,
              "shorthand": false,
              "computed": false,
              "key": {
                "type": "Identifier",
                "start": 55,
                "end": 58,
                "name": "set"
              },
              "kind": "init",
              "value": createRuntimeValueAst(
                generateFn('Array$prototype$length', ([nRv], { _this }) => {
                  // TODO
                  _this.value.length = parseRuntimeValue(nRv)
                  _this.resetAllValuePropertyDescriptor();
                }),
                'Array$prototype$length$setter'
              )
            },
            {
              "type": "Property",
              "start": 76,
              "end": 86,
              "method": true,
              "shorthand": false,
              "computed": false,
              "key": {
                "type": "Identifier",
                "start": 76,
                "end": 79,
                "name": "get"
              },
              "kind": "init",
              "value": createRuntimeValueAst(
                generateFn('Array$prototype$length', ([], { _this }) => {
                  return createNumber(_this.value.length)
                }),
                'Array$prototype$length$getter'
              )
            },
            {
              "type": "Property",
              "start": 90,
              "end": 105,
              "method": false,
              "shorthand": false,
              "computed": false,
              "key": {
                "type": "Identifier",
                "start": 90,
                "end": 98,
                "name": PROPERTY_DESCRIPTOR_DICTS.enumerable
              },
              "value": {
                "type": "Literal",
                "start": 100,
                "end": 105,
                "value": false,
                "raw": "false"
              },
              "kind": "init"
            },
            {
              "type": "Property",
              "start": 109,
              "end": 128,
              "method": false,
              "shorthand": false,
              "computed": false,
              "key": {
                "type": "Identifier",
                "start": 109,
                "end": 121,
                "name": PROPERTY_DESCRIPTOR_DICTS.configurable
              },
              "value": {
                "type": "Literal",
                "start": 123,
                "end": 128,
                "value": false,
                "raw": "false"
              },
              "kind": "init"
            }
          ]
        }
      ],
      "optional": false
    }
  }, globalEnv)

  runInnerAst([
    // _reflectAst,
    // _FunctionApplyAst, // 这俩种方式会导致globalEnv带有一个变量。
    // _FunctionCallAst,
    _FunctionBindAst,
  ])
  windowRv.get('Object').setWithDescriptor('keys', generateFn('Object$keys', ([objRv]) => {
    // console.error(objRv.keys(), _.filter(objRv.keys(), x => objRv.isAttrEnumerable(x)))
    // console.error(objRv.keys())
    return createArray(_.map(_.filter(objRv.keys(), x => objRv.isAttrEnumerable(x) && !isJsSymbolType(x)), createString))
  }))

  // 后续直接挂runtimeValue里，先暂时这样

  windowRv.get('Reflect').setWithDescriptor('ownKeys', generateFn('Reflect$ownKeys', (
    [
      objRv,
      attrRv,
    ],
  ) => {
    return createArray(_.map(objRv.keys(), t => {
      return createString(isJsSymbolType(t) ? t.toString(): t)
    }))
  }))
  
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