import _ from "lodash"
import { isInstanceOf } from "../../commonApi";

function flattenToken(tokenArr) {
  return [...tokenArr, ..._.flatten(_.map(tokenArr, 'prefixTokens'))];
}

export function getTotalToken(ast) {
  if (Array.isArray(ast)) {
    return _.flatten(_.map(ast, c => getTotalToken(c)))
  }
  if (!(isInstanceOf(ast, ASTItem))) {
    return [];
  }
  // console.log('ast', ast);
  return flattenToken(ast.tokens)
}

export default class ASTItem{
  constructor(value) {
    Object.assign(this, value)
    // console.log(this);
    const tokensList =  flattenToken(this.restTokens ?? []);
    for(const x in value) {
      if (['restTokens', 'prefixTokens'].includes(x)) {
        continue;
      }
      const tokens = getTotalToken(value[x]);
      tokensList.push(...tokens)
    }
    // console.log('value', _.cloneDeep(value));
    this.tokens = (_.uniqBy(_.flatten(tokensList), x => x.start + '#' + x.end)).sort(
      (a,b) => a.start - b.start
    );
    if (!Array.isArray(this.tokens) || !_.size(this.tokens)) {
      throw new Error('必传token数组')
    }
    this.addStarEnd();
    ['type', 'start', 'end'].forEach(f => this.ensureHas(f))
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
}