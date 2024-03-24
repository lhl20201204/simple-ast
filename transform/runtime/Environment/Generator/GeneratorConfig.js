import Environment from "..";
import parseAst from "../..";
import { isInstanceOf } from "../../../commonApi";
import { ENV_DICTS, GENERATOR_DICTS, RUNTIME_LITERAL, RUNTIME_VALUE_DICTS } from "../../constant";
import RuntimeValue, { RuntimePromiseInstanceValue } from "../RuntimeValue";
import { createObject, getTrueV, getUndefinedValue } from "../RuntimeValueInstance";
import createEnviroment, { createEmptyEnviromentExtraConfig } from "../createEnviroment";
import { createRuntimeValueAst } from "../utils";

let gid = 0;
export default class GeneratorConfig {
  constructor(x) {
    Reflect.defineProperty(this, GENERATOR_DICTS.isGeneratorConfig, {
      value: true,
      configurable: false,
      writable: false,
      enumerable: false,
    })
    this.id = gid++;
    this.ast = x.ast;
    this.done = false;
    this.name = x.name;
    this.contextEnv = x.contextEnv;
    this.runEnv = null;
    this.GeneratorFunctionRv = x.GeneratorFunctionRv;
    // this.contextEnv.setCurrentIsGeneratorFunctionEnv(true)
    this.contextThis = x.contextThis;
    this.contextArguments = x.contextArguments
    this.contextNextValue = getUndefinedValue()
    this.contextYieldEnv = null;
    this.pendingReturnValue = null;
    this.pendingPromiseNextValue = null;
    this.pendingResolveCallbackList = [];
    this.runtimeStack = [];
  }

  isPureAsync() {
    return this.ast.isAsyncToGenerator
  }

  canAwaitable() {
    return  this.ast.async;
  }

  isGeneratorConfig() {
    return this[GENERATOR_DICTS.isGeneratorConfig];
  }

  setNextValue(rv) {
    this.contextNextValue = rv;
  }

  getNextValue() {
    return this.contextNextValue;
  }

  setYieldEnv(env) {
    this.contextYieldEnv = env;
  }

  isNotPendingPromiseNextValue() {
    return !isInstanceOf(this.pendingPromiseNextValue, RuntimePromiseInstanceValue)
  }

  setPendingPromiseNextValue(rv) {
    if (!isInstanceOf(rv, RuntimePromiseInstanceValue) ) {
      throw new Error();
    }
    this.pendingPromiseNextValue = rv;
  }

  getPendingPromiseNextValue() {
    return this.pendingPromiseNextValue;
  }

  getYieldEnv() {
    return this.contextYieldEnv ?? this.runEnv;
  }

  setPendingReturnValue(rv) {
    this.pendingReturnValue = rv;
  }

  setPendingErrorValue(rv) {
    this.pendingErrorValue = rv;
  }

  clearPromiseCallbackList(env, index) {
    if (!_.isNumber(index)) {
      throw new Error('index 必须为数字')
    }
    this.pendingResolveCallbackList.shift()
    this.pendingResolveCallbackList.forEach(t => {
      t[index](createObject({
        value: getUndefinedValue(),
        done: getTrueV()
      }), env);

      // t[index + 2](createObject({
      //   value: getUndefinedValue(),
      //   done: getTrueV()
      // }), env);
      }
    )
    this.pendingResolveCallbackList.length = 0;
  }

  runGeneratorFunction() {
    let mounted = false;
    if (!this.runEnv) {
      this.runEnv = createEnviroment('generator_of_' + _.toString(this.name) + '_env', this.contextEnv, {
        [ENV_DICTS.isGeneratorFunction]: true,
        [ENV_DICTS.isAsyncFunction]: this.canAwaitable(),
        [ENV_DICTS.runningGenerateConfig]: this,
        [ENV_DICTS.isFunctionEnv]: true,
      }, createEmptyEnviromentExtraConfig())
      if (isInstanceOf(this.pendingReturnValue, RuntimeValue)) {
        this.runEnv.setCurrentEnvReturnValue(this.pendingReturnValue);
      }
      if (isInstanceOf(this.pendingErrorValue, RuntimeValue)) {
        this.runEnv.envStackStore.setError(this.pendingErrorValue)
      }

      this.runEnv.addConst(RUNTIME_LITERAL.this, this.contextThis)
      this.runEnv.addConst(RUNTIME_LITERAL.arguments, this.contextArguments)
      mounted = true;
      // console.log(this.contextEnv, '生成器初始化', this.contextEnv.get(RUNTIME_LITERAL.this))
    }
    this.runEnv.envStackStore.resetOldCacheEnvStack();
    try {
      // console.error('next-->开始')

      let value = getUndefinedValue()
      if (!this.done) {
        value = parseAst(this.ast.body, this.runEnv);
        if (this.runEnv.hadReturn()) {
          value = this.runEnv.getReturnValue()
        }
        // console.log('运行完毕value=', value)
      }
      this.done = true;
      return value;
    } finally {
      // console.log(_.cloneDeep(this.ast.body))
      if (mounted) {
        this.runEnv.setCacheFromParentEnv(true);
      }
    }
  }
}