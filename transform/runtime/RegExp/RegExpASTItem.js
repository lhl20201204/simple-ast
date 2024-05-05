import _ from "lodash"
import { isInstanceOf } from "../../commonApi";
import { strToRaw } from "./util";
import { AST_TYPE, TOKEN_TYPE } from "./constant";

function flattenToken(tokenArr) {
  return [...tokenArr, ..._.flatten(_.map(tokenArr, 'prefixTokens'))];
}

export function getTotalToken(ast) {
  if (Array.isArray(ast)) {
    return _.flatten(_.map(ast, c => getTotalToken(c)))
  }
  if (!(isInstanceOf(ast, RegExpASTItem))) {
    return [];
  }
  // console.log('ast', ast);
  return flattenToken(ast.tokens)
}

function findMayBeIndexOfTotalBackreference(ast) {
  const ret = [];
  for(const attr in ast) {
    const x = ast[attr]
    if (isInstanceOf(x, RegExpASTItem)) {
      if (x.is(AST_TYPE.Backreference)) {
        ret.push(x.ref)
      } else {
        ret.push(...findMayBeIndexOfTotalBackreference(x))
      }
    }
  }
  return ret;
}

export default class RegExpASTItem {
  constructor(value) {
    Object.assign(this, value)
    // console.log(this);
    const tokensList = flattenToken(this.restTokens ?? []);
    for (const x in value) {
      if (['restTokens', 'prefixTokens'].includes(x)) {
        continue;
      }
      const tokens = getTotalToken(value[x]);
      tokensList.push(...tokens)
    }
    // console.log('value', _.cloneDeep(value));
    try {
      this.tokens = (_.uniqBy(_.flatten(tokensList), x => x.start + '#' + x.end)).sort(
        (a, b) => a.start - b.start
      );
    } catch (e) {
      console.warn(new Error().stack, tokensList)
      throw e;
    }
    if ((!Array.isArray(this.tokens) || !_.size(this.tokens))) {
      console.warn(this)
      throw new Error('必传token数组')
    }
    this.addStarEnd();
    ['type', 'start', 'end'].forEach(f => this.ensureHas(f))
    if (this.type !== AST_TYPE.Flags || _.size(this.tokens)) {
      this.raw = strToRaw(_.map(this.tokens, 'value').join(''), findMayBeIndexOfTotalBackreference(this))
      if ((this.type === AST_TYPE.Flags && this.raw === '/')
        || (this.type === AST_TYPE.Alternative && this.raw === '|')) {
        // TODO 为了flag获取位置时特殊处理，额外添加了一个token
        this.raw = ''
      }
    }
  }

  is(type) {
    return this.type === type;
  }

  addStarEnd() {
    this.start = _.first(this.tokens).start;
    this.end = _.last(this.tokens).end;
    if (Reflect.has(this, 'restTokens')) {
      Reflect.deleteProperty(this, 'restTokens')
    }
  }

  ensureHas(attr) {
    if (_.isNil(_.get(this, attr))) {
      throw new Error(`没有${attr}属性`)
    }
  }

  set(attr, value) {
    this[attr] = value
  }

  find(cb) {
    if (cb(this)) {
      return this;
    }
    for (const attr of _.keys(this)) {
      const v = this[attr];
      if (isInstanceOf(v, RegExpASTItem)) {
        const t = v.find(cb)
        if (t) {
          return t;
        }
      }
    }
    return null;
  }

}