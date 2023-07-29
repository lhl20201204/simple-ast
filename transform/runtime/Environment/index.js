import parseAst from "..";
import { EnvJSON } from "../../commonApi";
import { DEBUGGER_DICTS, ENV_DICTS, JS_TO_RUNTIME_VALUE_TYPE, OUTPUT_TYPE, RUNTIME_LITERAL, RUNTIME_VALUE_TYPE, getRuntimeValueCreateByClassName } from "../constant";
import { _ErrorAst } from "./Native/Error";
import { _FunctionApplyAst, _FunctionBindAst, _FunctionCallAst, _FunctionPrototypeConstuctorAst } from "./Native/Function";
import { _ObjectAst } from "./Native/Object";
import { _reflectAst } from "./Native/Reflect";
import PropertyDescriptor from "./PropertyDescriptor";
import RuntimeValue, { RuntimeRefValue, createString, describeNativeClassAst, describeNativeFunction, getFalseV, getNullValue, getTrueV, getUndefinedValue } from "./RuntimeValue";
import { defalultTransformConfig, transformInnerAst } from "./WrapAst";
import parseRuntimeValue from "./parseRuntimeValue";
import { createRuntimeValueAst, isFunctionRuntimeValue } from "./utils";

const skipField = new Set([
  RUNTIME_LITERAL.null,
  RUNTIME_LITERAL.undefined,
  RUNTIME_LITERAL.true,
  RUNTIME_LITERAL.false,
]);

export const ObjectPrototypeV = new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, {}, {
  [RuntimeValue.proto]: getNullValue()
})

export function createObject(value) {
  return new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, value, {
    [RuntimeValue.proto]: ObjectPrototypeV,
  })
}

export default class Environment {
  static envId = 0;
  static window = new Environment('window', null,);

  static windowRv = Environment.window.getValue();

  constructor(name, parent, _config = {}) {
    this.envId = 'symbol(' + Environment.envId++ + ')';
    this.name = name;
    this._config = _config;
    this.parent = parent ?? null;
    this.$hideInHTML = RuntimeValue.isTransforming;
    if (parent) {
      this.parent.addChildren(this);
    }
    this.children = [];
    this.map = new Map()
    this.keyMap = new Map();
    this.constMap = new Map();
    this.placeholderMap = new Map();
  }

  addChildren(env) {
    this.children.push(env);
  }

  addToWindow(key, value) {
    if (this === Environment.window) {
      if (key === 'Reflect') {
        console.log('挂载到window', key, value);
      }
      Environment.windowRv.set(key, value)
    }
  }

  addConst(key, value) {
    if (this.keyMap.has(key)) {
      throw new Error(`${key} 已被定义`);
    }
    if (this.placeholderMap.has(key)) {
      this.placeholderMap.delete(key)
    }
    this.constMap.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'const');
  }

  addVar(key, value) {
    if (this.keyMap.has(key) && !['var', 'function'].includes(this.keyMap.get(key))) {
      throw new Error(`${key} 已被定义`);
    }
    this.map.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'var');
  }

  addLet(key, value, resign) {
    if (!resign && this.keyMap.has(key)) {
      console.error(this.keyMap);
      throw new Error(`${key} 已经定义`);
    }
    if (this.placeholderMap.has(key)) {
      this.placeholderMap.delete(key)
    }
    this.map.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'let')
  }

  addFunction(key, value) {
    if (this.placeholderMap.has(key)) {
      this.placeholderMap.delete(key)
    }
    this.map.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'function')
  }

  addClass(key, value) {
    if (this.placeholderMap.has(key)) {
      this.placeholderMap.delete(key)
    }
    this.map.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'class')
  }

  getEnv(key) {
    if (this.keyMap.has(key)) {
      return this;
    }
    return this.parent && this.parent.getEnv(key)
  }

  get(key) {
    if (this.placeholderMap.has(key)) {
      throw new Error(`Cannot access '${key}' before initialization`)
    }
    let env = this.getEnv(key);
    if (!env) {
      throw new Error(`${key} 为undefined`)
    }
    return env.map.get(key) || env.constMap.get(key)
  }

  set(key, value) {
    if (this.placeholderMap.has(key)) {
      throw new Error(`Cannot access '${key}' before initialization`)
    }
    const env = this.getEnv(key);
    if (!env) {
      return Environment.window.addVar(key, value)
    }
    if (env.constMap.has(key)) {
      throw new Error(`const ${key} 不能被重新定义`);
    }
    env.map.set(key, value)
    this.addToWindow(key, value)
  }

  placeholder(key, kind) {
    if (this.placeholderMap.has(key)) {
      throw new Error(`${key} 不能重新定义`)
    }
    // console.log('预处理开始', key);
    this.placeholderMap.set(key, kind);
  }

  findFunctionEnv() {
    if (this.isFunctionEnv()) {
      return this;
    }
    return this.parent && this.parent.findFunctionEnv()
  }

  hadReturn() {
    return this._config[ENV_DICTS.returnFlag];
  }

  isFunctionEnv() {
    return this._config[ENV_DICTS.isFunctionEnv];
  }

  findForEnv() {
    if (this.isForEnv()) {
      return this;
    }
    return this.parent && this.parent.findForEnv()
  }

  isForOfEnv() {
    return this._config[ENV_DICTS.isForOfEnv];
  }

  isForInEnv() {
    return this._config[ENV_DICTS.isForInEnv];
  }

  isForEnv() {
    return this.isForOfEnv() || this.isForInEnv() || this._config[ENV_DICTS.isForEnv]
      || (this.parent && this.parent.isForEnv())
  }

  isWhileEnv() {
    return this._config[ENV_DICTS.isWhileEnv] || (this.parent && this.parent.isWhileEnv());
  }

  hadBreak() {
    return this._config[ENV_DICTS.breakFlag];
  }

  hadContinue() {
    return this._config[ENV_DICTS.continueFlag];
  }


  getNearBreakContinueable() {
    if (this._config[ENV_DICTS.isForEnv] || this._config[ENV_DICTS.isWhileEnv]) {
      return this;
    }
    return this.parent && this.parent.getNearBreakContinueable()
  }

  setBreakFlag(flag) {
    if (!this.isForEnv() && !this.isWhileEnv()) {
      throw new Error('不在for 循环 或者while循环中无法 break')
    }
    this._config[ENV_DICTS.breakFlag] = flag;
    if (this !== this.getNearBreakContinueable()) {
      this.parent.setBreakFlag(flag)
    }
  }

  setContinueFlag(flag) {
    if (!this.isForEnv() && !this.isWhileEnv()) {
      throw new Error('不在for 或者while循环中无法 continue')
    }
    this._config[ENV_DICTS.continueFlag] = flag;
    if (this !== this.getNearBreakContinueable()) {
      this.parent.setContinueFlag(flag)
    }
  }

  setReturnValue(value) {
    this._config[ENV_DICTS.returnFlag] = true;
    this._config[ENV_DICTS.returnValue] = value
    if (!this.isFunctionEnv()) {
      this.parent.setReturnValue(value);
    }
  }

  getReturnValue() {
    return this._config[ENV_DICTS.returnValue];
  }

  isInUseStrict() {
    if (this._config[ENV_DICTS.isUseStrict]) {
      return true
    }
    return this.parent && this.parent.isInUseStrict()
  }

  reset() {
    this.parent = null;
    this.children = [];
    this.map = new Map()
    this.keyMap = new Map()
    this.constMap = new Map();
    this.placeholderMap = new Map();
    _.forEach([
      [RUNTIME_LITERAL.null, getNullValue(), 'const'],
      [RUNTIME_LITERAL.undefined, getUndefinedValue(), 'let'],
      [RUNTIME_LITERAL.true, getTrueV(), 'const'],
      [RUNTIME_LITERAL.false, getFalseV(), 'const'],
    ], ([key, value, kind]) => {
      this['add' + _.upperFirst(kind)](key, value)
    })
    // this.addLet('Object', ObjectClassV);
    const windowRv = Environment.windowRv
    this.addFunction('Function', FunctionClassV);
    parseAst(_ObjectAst, Environment.window);
    const objectRv= windowRv.get('Object')
    objectRv.setProtoType(ObjectPrototypeV);
    ObjectPrototypeV.set('constructor', objectRv)
    this.addLet('console', consoleV);

    this.addLet('window', windowRv);
    this.addConst(RUNTIME_LITERAL.this, windowRv);
    RuntimeValue.isTransforming = true;
    // console.error( '开始')
    
    const runInnerAst = (arr) => _.map(arr, ast => transformInnerAst(ast, {
      wrapRuntimeValue: false,
      transformConfig: defalultTransformConfig,
      parent: null
    })).forEach((x, i)=>{
      // console.error('-----', x)
       parseAst(x, Environment.window)
      });

    runInnerAst([
      _reflectAst,
      // _FunctionApplyAst, // 这俩种方式会导致this带有一个变量。
      // _FunctionCallAst,
      _FunctionBindAst,
    ])
    
    // 后续直接挂runtimeValue里，先暂时这样
    windowRv.get('Reflect').set('defineProperty', generateFn('Reflect$defineProperty', (
      [
        objRv,
        attrRv,
        attributesRv
      ],
    ) => {
      const attr = parseRuntimeValue(attrRv)
      const newPropertyDescriptor = new PropertyDescriptor(
          attributesRv.value,
          objRv.getPropertyDescriptor(attr)
        )
      // console.error(attr, newPropertyDescriptor)
      return objRv.set(attr,
        attributesRv.value.value ?? getNullValue(),
        newPropertyDescriptor
      )
    }))
    windowRv.get('Reflect').set('getOwnPropertyDescriptor', generateFn('Reflect$getOwnPropertyDescriptor', (
      [
        objRv,
        attrRv,
      ],
    ) => {
      const oldDescripor = objRv.getPropertyDescriptor(
        parseRuntimeValue(attrRv)
      );
   
      return oldDescripor ?  createObject(
        _.pick(oldDescripor, [
        'configurable',
        'enumerable',
        'value',
        'writable',
        'set',
        'get',
      ])) : getUndefinedValue()
    }))

    runInnerAst([
      _ErrorAst,
    ])
  
    RuntimeValue.isTransforming = false;
  }

  toString(noGetChildren) {
    const obj = { _envName: this.name, _envId: this.envId }
    _.forEach([...this.keyMap], ([key]) => {
      if (skipField.has(key)) {
        return;
      }
      const rv = this.constMap.get(key) || this.map.get(key)
      obj[key] = parseRuntimeValue(rv);
    })
    if (!noGetChildren && _.size(this.children)) {
      obj.children = _.map(this.children, c => c.toString())
    }
    return obj;
  }

  toWrite(noGetChildren) {
    const obj = { _envName: this.name, _envId: this.envId }
    _.forEach([...this.keyMap], ([key]) => {
      if (skipField.has(key)) {
        return;
      }
      const rv = this.constMap.get(key) || this.map.get(key)
      obj[key] = rv;
    })
    if (!noGetChildren && _.size(this.children)) {
      obj.children = _.map(_.filter(this.children, x => !x.$hideInHTML), c => c.toWrite())
    }
    return new EnvJSON(obj);
  }

  getValue() {
    const obj = {};
    _.forEach([...this.keyMap], ([k]) => {
      obj[k] = this.map.get(k) || this.constMap.get(k)
    })
    const windowRv = createObject(obj);
    // console.error(windowRv)
    return windowRv
  }

  getEnvPath() {
    const ret = []
    let t = this
    while (t) {
      ret.push([t.envId, t.name])
      t = t.parent
    }
    return ret;
  }
}


export const FunctionPrototypeV = new RuntimeRefValue(RUNTIME_VALUE_TYPE.class, {
  [RuntimeValue.symbolAst]: {
    type: "FunctionExpression",
    id: {
      type: 'Identifier',
      name: "Function$Prototype"
    },
    expression: false,
    generator: false,
    async: false,
    params: [],
    body: {
      type: "BlockStatement",
      body: []
    }
  },
  [RuntimeValue.symbolEnv]: Environment.window,
  [RuntimeValue.symbolName]: 'Function$Prototype',
}, {
  [RuntimeValue.proto]: ObjectPrototypeV,
});


const consoleValue = {};
const consoleV = createObject(consoleValue);

const generateFn = describeNativeFunction(Environment.window, FunctionPrototypeV, ObjectPrototypeV)


// const ObjectClassV = new RuntimeRefValue(RUNTIME_VALUE_TYPE.function, {
//   [RuntimeValue.symbolAst]: _ObjectAst,
//   [RuntimeValue.symbolEnv]: Environment.window,
//   [RuntimeValue.symbolName]: 'Object',
// }, {
//   [RuntimeValue._prototype]: ObjectPrototypeV,
//   [RuntimeValue.proto]: FunctionPrototypeV,
// })


export const FunctionClassV = generateFn('Function', ([argsRv]) => {
  console.log('new Function', parseRuntimeValue(argsRv))
})

FunctionClassV.setProtoType(FunctionPrototypeV);
FunctionPrototypeV.set('constructor', FunctionClassV);

FunctionPrototypeV.set('call', generateFn('call', ([newThisRv, ...argsRv], { _this: fnRv, env }) => {
  if (!isFunctionRuntimeValue(fnRv)) {
    throw new Error('call 函数不能调用在非函数上')
  }
  const middleEnv = new Environment(env._envName + '_call', env) 
  middleEnv.addConst(RUNTIME_LITERAL.this, newThisRv);
  return parseAst({
    type: "CallExpression",
    callee: createRuntimeValueAst(fnRv, fnRv.getDefinedName()+ '.call'),
    arguments: _.map(argsRv, (c, i) => createRuntimeValueAst(c, 'args' + i )),
    optional: false
  },middleEnv)
}))

FunctionPrototypeV.set('apply', generateFn('apply', ([newThisRv, argsRv], { _this: fnRv, env }) => {
  if (!isFunctionRuntimeValue(fnRv)) {
    console.error(fnRv);
    throw new Error('apply 函数不能调用在非函数上')
  }
  if (![RUNTIME_VALUE_TYPE.arguments, RUNTIME_VALUE_TYPE.array].includes(argsRv.type)){
    throw new Error('apply 函数第二个参数必须是类数组')
  }
  const middleEnv = new Environment(env._envName + '_apply', env) 
  middleEnv.addConst(RUNTIME_LITERAL.this, newThisRv);
  return parseAst({
    type: "CallExpression",
    callee: createRuntimeValueAst(fnRv, fnRv.getDefinedName()+ '.apply'),
    arguments: _.map(argsRv.value, (c, i) => createRuntimeValueAst(c, 'args' + i )),
    optional: false
  },middleEnv)
}))

// FunctionPrototypeV.set('constructor', FunctionClassV)


export function getFunctionPrototype() {
  return FunctionPrototypeV
}

export function getObjectPrototype() {
  return ObjectPrototypeV
}


export function createFunction(value) {
  const ret = new RuntimeRefValue(RUNTIME_VALUE_TYPE.function, value, {
    [RuntimeValue.proto]: FunctionPrototypeV,
  })
  ret.setProtoType(createObject({
    constructor: ret,
  }))
  return ret;
}

export function createObjectExtends(superClassRv) {
  return new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, {}, {
    [RuntimeValue.proto]: superClassRv.getProtoType()
  })
}


ObjectPrototypeV.set('toString', generateFn('Object$toString', ([argsRv]) => {
   console.log(parseRuntimeValue(argsRv))
}))

ObjectPrototypeV.set('hasOwnProperty', generateFn('Object$hasOwnProperty', ([attrRv], { _this }) => {
  return  _this.hasOwnProperty(parseRuntimeValue(attrRv)) ?  getTrueV() : getFalseV()
}))

const get__proto__Rv = generateFn('Object$prototype$__proto__', ([], { _this }) => {
  return _this === ObjectPrototypeV ? get__proto__Rv : _this.get(RUNTIME_LITERAL.$__proto__)
});

const set__proto__Rv = generateFn('Object$prototype$__proto__', ([argsRv], { _this }) => {
 return _this.set(RUNTIME_LITERAL.$__proto__, argsRv);
});

ObjectPrototypeV.set(RUNTIME_LITERAL.$__proto__, getNullValue(), new PropertyDescriptor({
  get: get__proto__Rv,
  set: set__proto__Rv,
}))

consoleV.set('log', generateFn('console$log', (args) => {
  // const newArr = _.map(args, item => {
  //   return parseRuntimeValue(item, {
  //     [DEBUGGER_DICTS.isOutputConsoleFlag]: true,
  //   });
  // })

  const getType = (type, item) => {
    if ([
      RUNTIME_VALUE_TYPE.string,
      RUNTIME_VALUE_TYPE.boolean,
      RUNTIME_VALUE_TYPE.undefined,
    ]) {
      return '%s';
    }
    if (type === RUNTIME_VALUE_TYPE.object) {
      return '%O'
    }
    if (type === RUNTIME_VALUE_TYPE.number) {
      return '%d'
    }

    console.error(item, type)
  }

  console.group('')
  const handleItem = rv => {
    const item = parseRuntimeValue(rv, { [DEBUGGER_DICTS.parseRuntimeValueDeepth]: 1, [DEBUGGER_DICTS.isOutputConsoleFlag]: true, });
    // console.log(item, '----')
    let tempProto 
    if (_.isArray(item)) {
      console.group('array')
      _.map(item, handleItem)
      return console.groupEnd()
    }
    if (_.size(item) && _.isObject(item) ) {
      // if (isUndefinedRuntimeValue(item?.getProto()))
      // console.error(item, isInstanceOf(rv, RuntimeRefValue))
      const outputValue = parseRuntimeValue(rv, {
        [DEBUGGER_DICTS.isOutputConsoleFlag]: true,
      });
    // const isOutputConsoleFlag = outputValue[DEBUGGER_DICTS.isOutputConsoleFlag]
      // console[isOutputConsoleFlag? 'groupCollapsed': 'group']('%c%s', 'color: green', isOutputConsoleFlag
      // ? outputValue.title
      // : ( getRuntimeValueCreateByClassName(rv) + '{}'))
     
        console.log( outputValue)
      // console.groupEnd()
      return;
    }
    // if (item && item[DEBUGGER_DICTS.isOutputConsoleFlag]) {
    //   console.groupCollapsed('%c%s', 'color: green', item.title)
    //   console.warn(item.content)
    //   console.groupEnd()
    //   return;
    // }

    if (JS_TO_RUNTIME_VALUE_TYPE(item) === RUNTIME_VALUE_TYPE.function) {
      // console.log(item.name)
      // console.groupCollapsed('%c%s', 'color: red','f ' + (item.name ?? '' ))
      console.log('%c%o', 'color: red', item)
      // console.groupEnd()
      return;
    }

    if (JS_TO_RUNTIME_VALUE_TYPE(item) === RUNTIME_VALUE_TYPE.object) {
      return console.log(item)
    }
    return console.log(`\x1B[96;100;4m${getType(JS_TO_RUNTIME_VALUE_TYPE(item), item)}`, item);
  };
  _.forEach(_.cloneDeep(args), handleItem)
  // console.warn(..._.flatten(_.cloneDeep(_.map(newArr, item => {
  //   if (item && item[('$___isOutputConsole___')]) {
  //     console.groupCollapsed(item.title)
  //     console.warn(item.content)
  //     console.groupEnd()
  //     // const dom = document.createElement('span');
  //     // dom.textContent = item[1]
  //     // let flag = true;
  //     // dom.onclick = () => {
  //     //   dom.textContent = flag ? item[2] : item[1]
  //     //   flag = !flag;
  //     // }
  //     // document.body.appendChild(dom)
  //     return [`${item.title} ▲`];
  //   }
  //   return [item];
  // }))))
  console.groupEnd()
}))

consoleV.set('error', generateFn('console$error', (args) => {
  const newArr = _.map(args, item => {
    return parseRuntimeValue(item);
  })
  // 直接结构就行了
  console.error(..._.cloneDeep(newArr));
}))


export { createString }

