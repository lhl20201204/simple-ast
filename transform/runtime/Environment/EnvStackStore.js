import { isInstanceOf } from "../../commonApi";
import { isYieldError } from "../Parse/parseYieldExpression";
import { AST_DICTS } from "../constant";
import AstConfig from "./Generator/AstConfig";
import RuntimeValue from "./RuntimeValue";

export default class EnvStackStore{
  constructor(owner) {
    this.owner = owner;
    this.error = null;
    this.oldCacheEnvStack = [];
    this.newCacheEnvStack = [];
  }

  resetOldCacheEnvStack() {
    // console.log('子缓存',[this.owner.name, this.owner.envId], _.cloneDeep(_.map(this.newCacheEnvStack, c => [c.name, c.envId])));
    this.oldCacheEnvStack = [...this.newCacheEnvStack];
    this.newCacheEnvStack = []
    // this.newCacheEnvStack = []
  }

  check() {
    if (!_.isNil(this.error)) {
      throw this.error;
    }

    if (this.owner.currentShouldReturn()) {
      const value = this.owner.getCurrentEnvReturnValue()
      if (!this.owner.hadReturn()) {
        this.owner.setReturnValue(value);
      }
      return value;
    }
    return null;
  }
  
  setError(error) {
    if (!isInstanceOf(error, Error)) {
      throw new Error('运行时错误')
    }
    if (!isYieldError(error)) {
      this.error = error;
    }
  }

  useCache(ast) {
    const astConfig = _.get(ast, AST_DICTS._config);
    if (!isInstanceOf(astConfig, AstConfig)) {
      return false;
    }
    return  astConfig.getNeedReRun() && this.oldCacheEnvStack.length > 0;
  }

  getCache() {
    const env = this.oldCacheEnvStack.shift()
    env.setCacheFromParentEnv(true);
    env.envStackStore.resetOldCacheEnvStack();
    console.log('使用缓存', _.cloneDeep(env));
    return env;
  }

  push(env) {
    // console.log('进来', env.name);
    this.newCacheEnvStack.push(env)
    // console.log('当前进来--->',[...this.newCacheEnvStack]);
  }

  pop() {
    const ret = this.newCacheEnvStack.pop()
    // console.log('出去', ret.name);
    return ret;
  }
}