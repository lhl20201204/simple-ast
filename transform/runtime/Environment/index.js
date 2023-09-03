import { EnvJSON } from "../../commonApi";
import { ENV_DICTS, RUNTIME_LITERAL } from "../constant";
import RuntimeValue from "./RuntimeValue";
import { createObject } from "./RuntimeValueInstance";
import { getWindowObject } from "./getWindow";
import parseRuntimeValue from "./parseRuntimeValue";

const skipField = new Set([
  RUNTIME_LITERAL.null,
  RUNTIME_LITERAL.undefined,
  RUNTIME_LITERAL.true,
  RUNTIME_LITERAL.false,
  RUNTIME_LITERAL.NaN,
]);

export default class Environment {
  static envId = 0;
  static window = new Environment('window', null);

  constructor(name, parent, _config = {}) {
    this.envId = 'symbol(' + Environment.envId++ + ')';
    this.name = name;
    this._config = _config;
    this.parent = parent ?? null;
    this[ENV_DICTS.$hideInHTML] = _config[ENV_DICTS.$hideInHTML] ?? RuntimeValue.isTransforming;
    if (parent) {
      this.parent.addChildren(this);
    }
    this.children = [];
    this.map = new Map()
    this.keyMap = new Map();
    this.constMap = new Map();
    this.placeholderMap = new Map();
    this.switchPlaceHolderMap = new Map();
  }

  setHideInHtml(hide) {
    this[ENV_DICTS.$hideInHTML] = hide;
  }

  getHideInHtml() {
    return this[ENV_DICTS.$hideInHTML];
  }

  addChildren(env) {
    this.children.push(env);
  }

  addToWindow(key, value) {
    if (this === Environment.window) {
      // if (key === 'Reflect') {
      //   // console.log('挂载到window', key, value);
      // }
      getWindowObject().setWithDescriptor(key, value)
    }
  }

  hasAttrPlaceholded(key) {
    return this.placeholderMap.has(key)
      || this.switchPlaceHolderMap.has(key);
  }

  deleteAttrPlaceholded(key) {
    if (this.placeholderMap.has(key)) {
      this.placeholderMap.delete(key)
    }
    if (this.switchPlaceHolderMap.has(key)) {
      this.switchPlaceHolderMap.delete(key)
    }
  }

  checkPlaceHolded(key) {
    if (this.hasAttrPlaceholded(key)) {
      this.deleteAttrPlaceholded(key)
    }
  }

  addConst(key, value) {
    // NaN 是全局自定义变量；不可重新声明，且不可改变值。
    if (this.keyMap.has(key) || [RUNTIME_LITERAL.NaN].includes(key)) {
      throw new Error(`${key} 已被定义`);
    }
    this.checkPlaceHolded(key)
    this.constMap.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'const');
  }

  addVar(key, value) {
    // NaN 是全局自定义变量
    if (this.keyMap.has(key) && !['var', 'function'].includes(this.keyMap.get(key))) {
      throw new Error(`${key} 已被定义`);
    }
    this.map.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'var');
  }

  addLet(key, value, resign) {
    if ((!resign && this.keyMap.has(key)) 
    || [RUNTIME_LITERAL.NaN].includes(key)
    ) {
      console.error(this.keyMap);
      throw new Error(`${key} 已经定义`);
    }
    this.checkPlaceHolded(key)
    this.map.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'let')
  }

  addFunction(key, value) {
    this.checkPlaceHolded(key)
    this.map.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'function')
  }

  addClass(key, value) {
    this.checkPlaceHolded(key)
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
    if (this.hasAttrPlaceholded(key)) {
      throw new Error(`Cannot access '${key}' before initialization`)
    }
    let env = this.getEnv(key);
    if (!env) {
      console.error(this)
      throw new Error(`${key} 为undefined`)
    }
    return env.map.get(key) || env.constMap.get(key)
  }

  set(key, value) {
    if (this.hasAttrPlaceholded(key)) {
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

  placeholder(key, kind, isSwitchPreDeclaration) {
    if (isSwitchPreDeclaration) {
      if (this.switchPlaceHolderMap.has(key)) {
        throw new Error(`${key} 不能重新定义`)
      }
      this.switchPlaceHolderMap.set(key, kind);
    } else {
      if (this.placeholderMap.has(key)) {
        throw new Error(`${key} 不能重新定义`)
      }
      this.placeholderMap.set(key, kind);
    }
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

  isNoNeedLookUpVarEnv() {
    return this._config[ENV_DICTS.noNeedLookUpVar];
  }

  isForEnv() {
    return this.isForOfEnv() || this.isForInEnv() || this._config[ENV_DICTS.isForEnv]
      || (this.parent && this.parent.isForEnv())
  }

  isWhileEnv() {
    return this._config[ENV_DICTS.isWhileEnv] || (this.parent && this.parent.isWhileEnv());
  }

  isSwitchEnv() {
    return this._config[ENV_DICTS.isSwitchEnv] || (this.parent && this.parent.isSwitchEnv());
  }

  hadBreak() {
    return this._config[ENV_DICTS.breakFlag];
  }

  hadContinue() {
    return this._config[ENV_DICTS.continueFlag];
  }


  getNearBreakContinueable() {
    if (this._config[ENV_DICTS.isForEnv]
      || this._config[ENV_DICTS.isWhileEnv]
      || this._config[ENV_DICTS.isSwitchEnv]) {
      return this;
    }
    return this.parent && this.parent.getNearBreakContinueable()
  }

  isNoBreackableEnv() {
    return !this.isForEnv() && !this.isWhileEnv() && !this.isSwitchEnv()
  }

  setBreakFlag(flag) {
    if (this.isNoBreackableEnv()) {
      throw new Error('不在for 循环 或者while或者switch循环中无法 break')
    }
    this._config[ENV_DICTS.breakFlag] = flag;
    if (this !== this.getNearBreakContinueable()) {
      this.parent.setBreakFlag(flag)
    }
  }

  setContinueFlag(flag) {
    if (this.isNoBreackableEnv()) {
      throw new Error('不在for 或者while 或者switch循环中无法 continue')
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

  toWrite(noGetChildren, parent) {
    const obj = { _envName: this.name, _envId: this.envId }
    _.forEach([...this.keyMap], ([key]) => {
      if (skipField.has(key)) {
        return;
      }
      const rv = this.constMap.get(key) || this.map.get(key)
      obj[key] = rv;
    })
    if (!noGetChildren && _.size(this.children)) {
      obj.children = _.map(_.filter(this.children, x => !x[ENV_DICTS.$hideInHTML]), c => c.toWrite())
    }
    if (parent && this.parent) {
      obj.parent = this.parent.toWrite(true, parent)
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
