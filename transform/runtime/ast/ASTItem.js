import _ from "lodash"

export function getTotalToken(ast) {
  if (Array.isArray(ast)) {
    return _.flatten(_.map(ast, c => getTotalToken(c)))
  }
  if (!(ast instanceof ASTItem)) {
    return [];
  }
  return ast.tokens;
}

export default class ASTItem{
  constructor(value) {
    Object.assign(this, value)
    const tokensList =  _.size(this.restTokens) ? [...this.restTokens ] : [];
    for(const x in value) {
      if (x === 'restTokens') {
        continue;
      }
      const tokens = getTotalToken(value[x]);
      tokensList.push(...tokens)
    }
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