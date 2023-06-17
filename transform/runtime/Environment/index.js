import { ObjectLike } from "../Parse/parseObjectExpression";
import RuntimeValue, { initConst } from "./RuntimeValue";
import parseRuntimeValue from "./parseRuntimeValue";
const KEY_VALUEMAP = initConst();
const skipField = new Set(_.map(KEY_VALUEMAP, '0'));
let id = 0;
export default class Environment {
  static window = new Environment('window', null, );
  constructor(name, parent, _config = {}) {
    this.envId = 'symbol(' + id ++ + ')';
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

  addConst(key, value) {
    if (this.keyMap.has(key)) {
      throw new Error(`${key} 已被定义`);
    }
    if (this.placeholderMap.has(key)) {
      this.placeholderMap.delete(key)
    }
    this.constMap.set(key, value);
    this.keyMap.set(key, 'const');
  }

  addVar(key, value) {
    if (this.keyMap.has(key) && !['var', 'function'].includes(this.keyMap.get(key))) {
      throw new Error(`${key} 已被定义`);
    } 
    this.map.set(key, value);
    this.keyMap.set(key, 'var');
  }

  addLet(key, value, resign) {
    if (!resign && this.keyMap.has(key)) {
      console.error(this);
      throw new Error(`${key} 已经定义`);
    }
    if (this.placeholderMap.has(key)) {
      this.placeholderMap.delete(key)
    }
    this.map.set(key, value);
    this.keyMap.set(key, 'let')
  }

  addFunction(key, value) {
    this.map.set(key, value);
    this.keyMap.set(key, 'function')
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
    const env = this.getEnv(key);
    if (! env) {
      if (key === 'window') {
        return Environment.window.getValue();
      } 
      console.error(this);
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
  }

  placeholder(key) {
    this.placeholderMap.set(key, true);
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

  isForEnv() {
    return this.isForOfEnv() || this._config.isForEnv
  }

  hadBreak() {
    return this._config.breakFlag;
  }

  hadContinue() {
    return this._config.continueFlag;
  }

  setBreakFlag(flag) {
    if (!this.isForEnv()) {
     throw new Error('不在for 循环中无法 break')
    }
    this._config.breakFlag = flag;
  }

  setContinueFlag(flag) {
    if (!this.isForEnv()) {
      throw new Error('不在for 循环中无法 continue')
    }
    this._config.continueFlag = flag;
  }

  beforeRunForStatement() {
    this._config.lastIsInForEnv = this._config.isForEnv;
    this._config.isForEnv = true;
    this.setBreakFlag(false)
    this.setContinueFlag(false)
  }

  afterRunForStatement() {
    this.setBreakFlag(false)
    this.setContinueFlag(false)
    this._config.isForEnv = this._config.lastIsInForEnv;
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
    _.forEach(KEY_VALUEMAP, ([key, value]) => {
      const v = typeof value === 'function' ? value(Environment.window) : value
      this.addConst(key, v)
    })
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

  getValue() {
    const obj = new ObjectLike();
    _.forEach([...this.keyMap], ([k]) => {
     obj[k] = this.map.get(k) || this.constMap.get(k)
   })
  return new RuntimeValue('object', obj) ;
  }
}
