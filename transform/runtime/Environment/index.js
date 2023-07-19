import parseAst from "..";
import { DEBUGGER_DICTS, JS_TO_RUNTIME_VALUE_TYPE, OUTPUT_TYPE, RUNTIME_LITERAL, RUNTIME_VALUE_TYPE } from "../constant";
import { _ErrorAst } from "./Native/Error";
import { _FunctionApplyAst, _FunctionBindAst, _FunctionCallAst } from "./Native/Function";
import { _reflectAst } from "./Native/Reflect";
import PropertyDescriptor from "./PropertyDescriptor";
import RuntimeValue, { RuntimeRefValue, createString, describeNativeClassAst, describeNativeFunction, getFalseV, getNullValue, getTrueV, getUndefinedValue } from "./RuntimeValue";
import { transformInnerAst } from "./WrapAst";
import parseRuntimeValue from "./parseRuntimeValue";

const skipField = new Set([
  RUNTIME_LITERAL.null,
  RUNTIME_LITERAL.undefined, 
  RUNTIME_LITERAL.true,
  RUNTIME_LITERAL.false,
]);

export const ObjectPrototypeValue = {};
export const ObjectPrototypeV = new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, ObjectPrototypeValue, {
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
    console.log('预处理开始', key);
    this.placeholderMap.set(key, kind);
  }

  findFunctionEnv() {
    if (this.isFunctionEnv()) {
      return this;
    }
    return this.parent && this.parent.findFunctionEnv()
  }

  hadReturn() {
    return this._config.returnFlag;
  }

  isFunctionEnv() {
    return this._config.isFunctionEnv;
  }

  findForEnv() {
    if (this.isForEnv()) {
      return this;
    }
    return this.parent && this.parent.findForEnv()
  }

  isForOfEnv() {
    return this._config.isForOfEnv;
  }

  isForInEnv() {
    return this._config.isForInEnv;
  }

  isForEnv() {
    return this.isForOfEnv() || this.isForInEnv() || this._config.isForEnv 
    || (this.parent && this.parent.isForEnv())
  }

  isWhileEnv() {
    return this._config.isWhileEnv || (this.parent && this.parent.isWhileEnv());
  }

  hadBreak() {
    return this._config.breakFlag;
  }

  hadContinue() {
    return this._config.continueFlag;
  }


  getNearBreakContinueable(){
    if (this._config.isForEnv || this._config.isWhileEnv) {
      return this;
    }
    return this.parent && this.parent.getNearBreakContinueable()
  }

  setBreakFlag(flag) {
    if (!this.isForEnv() && !this.isWhileEnv()) {
      throw new Error('不在for 循环 或者while循环中无法 break')
    }
    this._config.breakFlag = flag;
    if (this !== this.getNearBreakContinueable()) {
      this.parent.setBreakFlag(flag)
    }
  }

  setContinueFlag(flag) {
    if (!this.isForEnv() && !this.isWhileEnv()) {
      throw new Error('不在for 或者while循环中无法 continue')
    }
    this._config.continueFlag = flag;
    if (this !== this.getNearBreakContinueable()) {
      this.parent.setContinueFlag(flag)
    }
  }

  setReturnValue(value) {
    this._config.returnFlag = true;
    this._config.returnValue = value
    if (!this.isFunctionEnv()) {
      this.parent.setReturnValue(value);
    }
  }

  getReturnValue() {
    return this._config.returnValue;
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
    this.addLet('Object', ObjectClassV);
    this.addLet('Function', FunctionClassV);
    this.addLet('console', consoleV);
    const windowRv = Environment.windowRv
    this.addLet('window', windowRv);
    this.addConst(RUNTIME_LITERAL.this, windowRv);
    RuntimeValue.isTransforming = true;
    _.map([
      _reflectAst,
      _FunctionApplyAst,
      _FunctionCallAst,
      _FunctionBindAst,
      _ErrorAst,
    ], ast => transformInnerAst(ast, {
      parent: null
    }).toAST()).forEach(x => parseAst(x, Environment.window));
    windowRv.get('Reflect').set('defineProperty', generateFn('Reflect$defineProperty', (
      [
       objRv, 
       attrRv,
       attributesRv
      ],
    )=> {
      // 底层调用方法
      // console.error('Reflect.defineProperty', 
      // objRv, 
      // attrRv,
      // attributesRv,)
      const attr = parseRuntimeValue(attrRv)
      objRv.set(attr, 
        getNullValue(), 
        new PropertyDescriptor(
          attributesRv.value, 
          objRv.getPropertyDescriptor(attr)
        ))
    }))
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
      obj.children = _.map(this.children, c => c.toWrite())
    }
    return obj;
  }

  getValue() {
    const obj = {};
    _.forEach([...this.keyMap], ([k]) => {
      obj[k] = this.map.get(k) || this.constMap.get(k)
    })
    return createObject(obj);
  }

  getEnvPath() {
    const ret = []
    let t = this
    while(t) {
      ret.push([t.envId, t.name])
      t = t.parent
    }
    return ret;
  }
}


export const FunctionPrototypeV = new RuntimeRefValue(RUNTIME_VALUE_TYPE.class, {
  [RuntimeValue.symbolAst]: {
    "type": "FunctionExpression",
    "id": null,
    "expression": false,
    "generator": false,
    "async": false,
    "params": [],
    "body": {
      "type": "BlockStatement",
      "body": []
    }
  },
  [RuntimeValue.symbolEnv]: Environment.window,
  [RuntimeValue.symbolName]: 'Function$Prototype',
},{
  [RuntimeValue._prototype]: getUndefinedValue(),
  [RuntimeValue.proto]: ObjectPrototypeV,
});

const consoleValue = {};
const consoleV = createObject(consoleValue);

const generateFn = describeNativeFunction(Environment.window,FunctionPrototypeV)


const ObjectClassV =  new RuntimeRefValue(RUNTIME_VALUE_TYPE.class, {
  [RuntimeValue.symbolAst]: describeNativeClassAst('Object'),
  [RuntimeValue.symbolEnv]: Environment.window,
  [RuntimeValue.symbolName]: 'Object',
}, {
  [RuntimeValue._prototype]: ObjectPrototypeV,
  [RuntimeValue.proto]: FunctionPrototypeV,
})


export const FunctionClassV = new RuntimeRefValue(RUNTIME_VALUE_TYPE.class, {
  [RuntimeValue.symbolAst]: describeNativeClassAst('Function'),
  [RuntimeValue.symbolEnv]: Environment.window,
  [RuntimeValue.symbolName]: 'Function'
}, {
  [RuntimeValue._prototype]: FunctionPrototypeV,
  [RuntimeValue.proto]: FunctionPrototypeV,
})

// FunctionPrototypeV.set('constructor', FunctionClassV)


export function getFunctionPrototype() {
  return FunctionPrototypeV
}

export function getObjectPrototype() {
  return ObjectPrototypeV
}


export function createFunction(value) {
  return new RuntimeRefValue(RUNTIME_VALUE_TYPE.function, value, {
    [RuntimeValue.proto]: FunctionPrototypeV,
  })
}

export function createObjectExtends(superClassRv) {
  return new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, {}, {
    [RuntimeValue.proto]: superClassRv.getProtoType()
  })
}


ObjectPrototypeV.set('toString', generateFn( 'Object$toString', (args) => {
  console.warn('this is a toString');
}))

consoleV.set('log', generateFn('console$log', (args) => {
  const newArr = _.map(args, item => {
    return parseRuntimeValue(item, {
      isOutputConsole: true,
    });
  })
  // 直接结构就行了
  // console.warn(..._.cloneDeep(_.filter(newArr, item => _.get(item, '0') !== '_groupCollapsed')));
  // _.forEach(_.cloneDeep(_.filter(newArr, item => _.get(item, '0') === '_groupCollapsed')), x => {
  //   console.groupCollapsed(x[1])
  //   console.warn(x[2])
  //   console.groupEnd()
  // })

  const getType = (type, item) => {
    if([
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
  const handleItem = item => {
    if (_.isArray(item)) {
      console.group('array')
      _.map(item, handleItem)
      return console.groupEnd()
    }
    if (item && item[DEBUGGER_DICTS.isOutputConsoleFlag]) {
      console.groupCollapsed('%c%s', 'color: green', item.title)
      console.warn(item.content)
      console.groupEnd()
      return;
    }

    if (JS_TO_RUNTIME_VALUE_TYPE(item) === RUNTIME_VALUE_TYPE.object) {
      return console.warn(item)
    }
    return console.log(`\x1B[96;100;4m${getType(JS_TO_RUNTIME_VALUE_TYPE(item), item)}`, item);
  };
  _.forEach(_.cloneDeep(newArr), handleItem)
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


export  { createString }

