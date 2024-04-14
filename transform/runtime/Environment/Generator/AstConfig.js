import _ from "lodash";
import { isInstanceOf } from "../../../commonApi";
import { AST_DICTS } from "../../constant";
import { getUndefinedValue } from "../RuntimeValueInstance";
import RuntimeValue from "../RuntimeValue";


export default class AstConfig{
  constructor() {
    this[AST_DICTS.needReRun] = true;
    this[AST_DICTS.astCacheValue] = null;
    this[AST_DICTS.iteratorRuntimeValue] = null;
    this[AST_DICTS.generatorAstConfig] = null;
    this.map = new Map();
  }

  set(key, astConfig) {
    if (!isInstanceOf(astConfig, AstConfig)) {
      throw new Error('挂载错误')
    }
    this.map.set(key, astConfig);
  }

  get(key) {
    return this.map.get(key);
  }

  getOrNew(key) {
    return function () {
      if (!isInstanceOf(this.map.get(key), AstConfig)) {
        this.map.set(key, new AstConfig())
      }
      return this.map.get(key);
    }
  } 

  

  getGeneratorAstConfig = this.getOrNew(AST_DICTS.generatorAstConfig)

  getYieldStarToForOfRightAstConfig = this.getOrNew(AST_DICTS.yieldStarToForOfRightAstConfig)

  getYieldStarToForOfBodyAstConfig = this.getOrNew(AST_DICTS.yieldStarToForOfBodyAstConfig)

  getYieldStarToForOfYieldAstConfig = this.getOrNew(AST_DICTS.yieldStarToForOfYieldAstConfig)

  getForOfAwaitInitAstConfig = this.getOrNew(AST_DICTS.forOfAwaitInitAstConfig)

  getPreDeclarationAstConfig = this.getOrNew(AST_DICTS.preDeclarationAstConfig);

  getTaggedTemplateExpressionExectueAstConfig = this.getOrNew(AST_DICTS.TaggedTemplateExpressionExectueAstConfig);

  getTaggedTemplateExpressionReflectAstConfig = this.getOrNew(AST_DICTS.TaggedTemplateExpressionReflectAstConfig);

  getAssignmentExpressionInWithBlockAstConfig = this.getOrNew(AST_DICTS.AssignmentExpressionInWithBlockAstConfig);

  resetForOfAwaitInitAstConfig = () => {
    this.map.set(AST_DICTS.forOfAwaitInitAstConfig, new AstConfig())
  }

  setIteratorRuntimeValue(rv) {
    // console.error(rv);
    this.map.set(AST_DICTS.iteratorRuntimeValue, rv)
  }

  getIteratorRuntimeValue() {
    return this.map.get(AST_DICTS.iteratorRuntimeValue)
  }

  getNeedReRun() {
    return this[AST_DICTS.needReRun];
  }

  setNeedReRun(bool) {
    this[AST_DICTS.needReRun]= bool;
  }

  setCacheRuntimeValue(rv) {
    this[AST_DICTS.astCacheValue] = rv;
  }

  getCacheRuntimeValue() {
    return this[AST_DICTS.astCacheValue]
  }

  setBeforeHook(cb) {
    this[AST_DICTS.beforeHook] = cb;
  }

  setAfterHook(cb) {
    this[AST_DICTS.afterHook] = cb;
  }

  setNeedReceiveNextValue(bool) {
    this[AST_DICTS.needReceiveNextValue] = bool;
  }

  getNeedReceiveNextValue() {
    return this[AST_DICTS.needReceiveNextValue];
  }

}

export function ensureAstHadConfig(ast) {
  if (!ast.type) {
    throw new Error('ast 必须要用type属性')
  }
  if (!isInstanceOf(ast[AST_DICTS._config], AstConfig)) {
    ast[AST_DICTS._config] = new AstConfig()
  }
}

export function clearAstConfig(ast) {
  if (!ast.type) {
    throw new Error('')
  }
  _.forEach(ast, (v, k) => {
    if (Array.isArray(v)) {
      _.map(v, clearAstConfig)
      return
    }
    if (k === AST_DICTS._config || !_.get(v, 'type')) {
      return;
    }
    clearAstConfig(v)
  })
  ast[AST_DICTS._config] = new AstConfig()
}


export function withRecordEnvStack(ast, env, cb) {
  const isGeneratorEnv = env.canYieldAble();
  if (isGeneratorEnv) {
    ensureAstHadConfig(ast);
    const astConfig= ast[AST_DICTS._config];
    if (!astConfig.getNeedReRun()) {
      return astConfig.getCacheRuntimeValue()
    }
    astConfig.setNeedReRun(true);
  }
  let retRv = cb(ast, env);
  if (isGeneratorEnv) {
    const astConfig = ast[AST_DICTS._config];
    astConfig.setNeedReRun(false);
    astConfig.setCacheRuntimeValue(retRv);
  }
  return retRv;
}