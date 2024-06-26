import { EnvJSON, isInstanceOf } from "../../commonApi";
import { ENV_DICTS, RUNTIME_LITERAL } from "../constant";
import EnvStackStore from "./EnvStackStore";
import RuntimeValue from "./RuntimeValue";
import { createObject, getUndefinedValue } from "./RuntimeValueInstance";
import { getWindowObjectRv } from "./getWindow";
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
    this.unvisibleRuntimeValueStack = [];
    this.map = new Map()
    this.keyMap = new Map();
    this.placeholderMap = new Map();
    this.switchPlaceHolderMap = new Map();
    this.envStackStore = new EnvStackStore(this);
  }

  setDirective(type) {
    if (!_.size(this._config.innerDirectiveMap)) {
      this._config.innerDirectiveMap = {};
    }
    this._config.innerDirectiveMap[type] = true;
  }

  copyFromParentEnv(parentEnv) {
    for (const [x, y] of parentEnv.keyMap) {
      this.keyMap.set(x, y)
    }
    for (const [x, y] of parentEnv.map) {
      this.map.set(x, y)
    }
  }

  hasKey(key) {
    return this.keyMap.has(key)
  }

  setCacheFromParentEnv(bool) {
    this._config[ENV_DICTS.isCacheFromParentEnv] = bool
  }

  isCacheFromParentEnv() {
    return this._config[ENV_DICTS.isCacheFromParentEnv];
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
      getWindowObjectRv().setWithDescriptor(key, value);
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
    if (this.keyMap.has(key) && !this.isCacheFromParentEnv()
    ) {
      throw new Error(`${key} 已被定义`);
    }
    this.checkPlaceHolded(key)
    this.map.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'const');
  }

  addVar(key, value) {
    if (this.keyMap.get(key) === 'params') {
      return;
    }
    if (this.keyMap.has(key)
      && !['var'].includes(this.keyMap.get(key))
    ) {
      throw new Error(`${key} 已被定义`);
    }
    this.map.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'var');
  }

  addParams(key, value) {
    if (this.keyMap.has(key)) {
      throw new Error(`${key} 已被定义`);
    }
    this.map.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'params');
  }

  addLet(key, value, resign) {
    if ((!resign && this.keyMap.has(key)) && !this.isCacheFromParentEnv()) {
      console.error(this.keyMap);
      throw new Error(`${key} 已经定义`);
    }
    this.checkPlaceHolded(key)
    this.map.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'let')
  }

  addFunction(key, value) {
    // this.checkPlaceHolded(key)
    const env = this.getDefineEnvByKey(key) ?? Environment.window;
    const originType = env.keyMap.get(key);
    // 可能为undefined; 比如预提升
    if (originType === 'var') {
      env.map.set(key, value);
      env.addToWindow(key, value);
      env.keyMap.set(key, 'var')
      return;
    }

    this.map.set(key, value);
    this.addToWindow(key, value);
    this.keyMap.set(key, env === this ? (originType ?? 'function') : 'function')
  }

  addClass(key, value) {
    this.checkPlaceHolded(key)
    if (this.keyMap.has(key)) {
      console.error(this.keyMap);
      throw new Error(`${key} 已经定义`);
    }
    this.map.set(key, value);
    this.addToWindow(key, value)
    this.keyMap.set(key, 'class')
  }

  getDefineEnvByKey(key) {
    if (this.keyMap.has(key) || this.hasAttrPlaceholded(key)) {
      return this;
    }
    return this.parent && this.parent.getDefineEnvByKey(key)
  }

  get(key) {
    let env = this.getDefineEnvByKey(key);
    if (!env) {
      throw new Error(`${key} 为undefined`)
    }

    if (env.hasAttrPlaceholded(key)) {
      throw new Error(`Cannot access '${key}' before initialization`)
    }
    return env.map.get(key)
  }

  set(key, value) {
    const env = this.getDefineEnvByKey(key);
    if (env && env.hasAttrPlaceholded(key)) {
      throw new Error(`Cannot access '${key}' before initialization`)
    }

    if (!env) {
      return Environment.window.addVar(key, value)
    }
    if (env.keyMap.get(key) === 'const') {
      throw new Error(`const ${key} 不能被重新定义`);
    }
    env.map.set(key, value)
    env.addToWindow(key, value)
  }

  placeholder(key, kind, isSwitchPreDeclaration) {
    if (this.isCacheFromParentEnv()) {
      return;
    }
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

  pushEnvStack() {
    if (this.parent) {
      this.parent.envStackStore.push(this)
    }
  }

  popEnvStack() {
    if (this.parent) {
      const t = this.parent.envStackStore.pop()
      if (!_.isUndefined(t) && (t !== this)) {
        throw new Error('出入栈运行时错误')
      }
      return t;
    }
  }

  hadReturn() {
    return this._config[ENV_DICTS.returnFlag];
  }

  setCurrentEnvReturnValue(rv) {
    this._config[ENV_DICTS.currentEnvReturnFlag] = true;
    this._config[ENV_DICTS.currentEnvReturnValue] = rv;
  }

  getCurrentEnvReturnValue() {
    return this._config[ENV_DICTS.currentEnvReturnValue];
  }

  currentShouldReturn() {
    return this._config[ENV_DICTS.currentEnvReturnFlag];
  }

  canDirectlyReturn(ast) {
    return this.hadReturn() && !this.envStackStore.useCache(ast)
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

  pushCurrentWithRuntimeValue(rv) {
    if (!this._config[ENV_DICTS.currentWithRuntimeValueList]) {
      this._config[ENV_DICTS.currentWithRuntimeValueList] = []
    }
    this._config[ENV_DICTS.currentWithRuntimeValueList].push(rv)
  }

  popCurrentWithRuntimeValue() {
    return this._config[ENV_DICTS.currentWithRuntimeValueList].pop()
  }

  getCurrentWithRuntimeValue() {
    return this._config[ENV_DICTS.currentWithRuntimeValueList][
      _.size(this._config[ENV_DICTS.currentWithRuntimeValueList]) - 1
    ]
  }

  canYieldAble() {
    return this.isInGeneratorEnv() || this.canSleepAble()
  }

  isInWithBlock() {
    return _.size(this._config[ENV_DICTS.currentWithRuntimeValueList]) > 0
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

  isLabeledEnv() {
    return this._config[ENV_DICTS.isLabelEnv] || (this.parent && this.parent.isLabeledEnv());
  }

  isWhileEnv() {
    return this._config[ENV_DICTS.isWhileEnv]
      || this._config[ENV_DICTS.isDoWhileEnv]
      || (this.parent && this.parent.isWhileEnv());
  }

  isSwitchEnv() {
    return this._config[ENV_DICTS.isSwitchEnv] || (this.parent && this.parent.isSwitchEnv());
  }

  isTryCatchFinallyEnv() {
    return this._config[ENV_DICTS.isTryEnv] || this._config[ENV_DICTS.isFinallyEnv] || this._config[ENV_DICTS.isCatchEnv];
  }

  isInTryCatchFinallyEnv() {
    if (this.isTryCatchFinallyEnv()) {
      return true;
    }
    return !!this.parent && this.parent.isInTryCatchFinallyEnv()
  }

  hadBreak() {
    if (this.hadContinue() && this.getNearBreakContinueableEnv() !== this) {
      // console.warn('continue跨级break')
      // this.setContinueFlag(false)
      return true
    }
    return this._config[ENV_DICTS.breakFlag]
  }

  hadContinue() {
    return this._config[ENV_DICTS.continueFlag];
  }

  canUseRuntimeValueStack() {
    return !!this._config[ENV_DICTS.isOpenRuntimeValueStack];
  }

  setRuntimeValueByStackIndex(index, rv) {
    if (this.unvisibleRuntimeValueStack[index]) {
      throw new Error('重复执行');
    }
    this.unvisibleRuntimeValueStack[index] = rv;
  }

  findCanUseRuntimeValueStackEnv() {
    if (this.canUseRuntimeValueStack()) {
      return this;
    }
    return !!this.parent && this.parent.findCanUseRuntimeValueStackEnv()
  }

  getRuntimeValueByStackIndex(index) {
    const env = this.findCanUseRuntimeValueStackEnv();
    if (!env) {
      throw new Error('没有开启runtimeValueStack模式')
    }
    return env.unvisibleRuntimeValueStack[index]
  }

  canSleepAble() {
    return _.get(this._config, 'innerDirectiveMap.sleep');
  }

  currentIsGeneratorFunctionEnv() {
    return this._config[ENV_DICTS.isGeneratorFunction]
  }

  currentIsAsyncFunctionEnv() {
    return this._config[ENV_DICTS.isAsyncFunction]
  }

  isInAsyncEnv() {
    return this.currentIsAsyncFunctionEnv() ||
      (!!this.parent && this.parent.isInAsyncEnv())
  }

  isInGeneratorEnv() {
    let t = this;
    while (t && !t.isFunctionEnv()) {
      t = t.parent;
    }
    return t?.currentIsGeneratorFunctionEnv?.();
  }

  setCurrentIsGeneratorFunctionEnv(bool) {
    this._config[ENV_DICTS.isGeneratorFunction] = bool;
  }

  setCurrentIsAsyncFunctionEnv(bool) {
    this._config[ENV_DICTS.isAsyncFunction] = bool;
  }

  getRunningGenerateConfig() {
    if (this.canSleepAble()) {
      return null;
    }
    let generatorEnv = this;
    while (generatorEnv && !generatorEnv.currentIsGeneratorFunctionEnv()) {
      generatorEnv = generatorEnv.parent;
    }
    if (!generatorEnv || !generatorEnv.currentIsGeneratorFunctionEnv()) {
      // console.error(this, generatorEnv)
      throw new Error('获取yield 值错误')
    }
    const generateConfig = generatorEnv._config[ENV_DICTS.runningGenerateConfig];
    if (!generateConfig?.isGeneratorConfig?.()) {
      throw new Error('获取generateConfig失败')
    }
    return generateConfig
  }

  getNextValue() {
    const g = this.getRunningGenerateConfig();
    return g ? g.getNextValue() : getUndefinedValue()
  }

  setYieldValue(rv) {
    if (!isInstanceOf(rv, RuntimeValue)) {
      throw new Error(RUNTIME_LITERAL.yield + '返回值错误');
    }
    this._config[ENV_DICTS.yieldValue] = rv;
  }

  getYieldValue() {
    return this._config[ENV_DICTS.yieldValue];
  }

  getNearBreakContinueableEnv() {
    // console.log(findBreak, this._config[ENV_DICTS.isWhileEnv])
    if ((this._config[ENV_DICTS.isForEnv]
      || this._config[ENV_DICTS.isWhileEnv]
      || this._config[ENV_DICTS.isLabelEnv]
      || this._config[ENV_DICTS.isDoWhileEnv]
      || this._config[ENV_DICTS.isSwitchEnv])
      && (
        (
          _.isNil(this._config[ENV_DICTS.currentBreakContinueValue])
          || (
            this._config[ENV_DICTS.isLabelEnv] &&
            this._config[ENV_DICTS.currentEnvLabelValue] === this._config[ENV_DICTS.currentBreakContinueValue]
          )
        )
      )
    ) {
      return this;
    }
    return this.parent && this.parent.getNearBreakContinueableEnv()
  }

  isNoBreackableEnv() {
    return !this.isForEnv() && !this.isWhileEnv() && !this.isSwitchEnv() && !this.isLabeledEnv();
  }

  ensureInBreakEnv() {
    if (this.isNoBreackableEnv()) {
      throw new Error('不在for/forof/forin/while/dowhile/switch/labeledStatement循环中无法 break')
    }
  }

  setBreakFlag(flag, name) {
    this.ensureInBreakEnv()
    this._config[ENV_DICTS.breakFlag] = flag;
    this._config[ENV_DICTS.currentBreakContinueValue] = name;
    if (this !== this.getNearBreakContinueableEnv()) {
      this.parent.setBreakFlag(flag, name)
    }
  }

  setContinueFlag(flag) {
    this.ensureInBreakEnv()
    this._config[ENV_DICTS.continueFlag] = flag;
  }

  setContinueFlagDfs(flag, name) {
    this.ensureInBreakEnv()
    this._config[ENV_DICTS.continueFlag] = flag;
    this._config[ENV_DICTS.currentBreakContinueValue] = name;
    if (this !== this.getNearBreakContinueableEnv()) {
      this.parent.setContinueFlagDfs(flag, name)
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
      const rv = this.map.get(key)
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
      const rv = this.map.get(key)
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
      obj[k] = this.map.get(k)
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
