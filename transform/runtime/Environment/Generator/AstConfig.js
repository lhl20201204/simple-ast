import _ from "lodash";
import { isInstanceOf } from "../../../commonApi";
import { AST_DICTS } from "../../constant";
import { getUndefinedValue } from "../RuntimeValueInstance";


export default class AstConfig{
  constructor() {
    this[AST_DICTS.needReRun] = true;
    this[AST_DICTS.astCacheValue] = null;
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