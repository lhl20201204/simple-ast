import _ from "lodash";
import { TOKEN_TYPE_VALUE_LIST } from "./constant";

export class TokenChar {
  constructor(value) {
    Object.assign(this, value)
  }
}

export class RegExpToken {
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
    if (_.size(prefixTokens) && _.some(prefixTokens, c => !(c instanceof RegExpToken))) {
      console.warn(prefixTokens)
      throw new Error('无效相关token');
    }
    this.prefixTokens = prefixTokens;
  }

  is(type) {
    return this.type === type;
  }

  isOneOf(typeList) {
    if (!_.isArray(typeList)) {
      throw '类型错误'
    }
    return _.some(typeList, c => this.is(c))
  }

  change(type) {
    this.type = type;
    return this;
  }

  static createToken(...args) {
    if (!_.includes(TOKEN_TYPE_VALUE_LIST, args[0])) {
      throw 'type 错误'
    }
    return new RegExpToken(...args);
  }
}