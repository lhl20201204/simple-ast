import _ from "lodash";

export class TokenChar {
  constructor(value) {
    Object.assign(this, value)
  }
}

export class Token {
  constructor(type, value, prefixTokens = []) {
    this.type = type;
    this.chars = value;
    this.value = value.map(c => c.char).join('');
    this.startRow = value[0].row;
    this.startCol = value[0].col;
    this.start = value[0].index;
    this.endRow = _.last(value).row;
    this.endCol = _.last(value).col;
    this.end = _.last(value).index;
    if (_.size(prefixTokens) && _.some(prefixTokens, c => !(c instanceof Token))) {
      throw new Error('无效相关token');
    }
    this.prefixTokens = prefixTokens;
  }

  is(type) {
    return this.type === type;
  }

  change(type) {
    this.type = type;
    return this;
  }

  static createToken(...args) {
    return new Token(...args);
  }
}