import { AssertView } from "./AssertView";
import { isInstanceOf } from "./util";

export default class AcceptStr{
  constructor(value, negate = false, assertView = null) {
    if (!_.isArray(value)) {
      this.list = [value]
    } else {
      this.list = value;
    }
    this.negate = negate;
    if (!_.isNil(assertView) && !isInstanceOf(assertView, AssertView)) {
      throw 'assertView 类型错误'
    }
    this.assertView = assertView;
  }

  hadAssertView() {
    return isInstanceOf(this.assertView, AssertView);
  }

  isValid(target, ...rest) {
    // 可接受 字符， 数组， 函数。
    // 转移状态的时候，函数更为自由，覆盖范围更广。
    let bol = false;
    if (_.isArray(target)) {
      bol = _.every(target, c => _.includes(this.list, c))
    } else if (_.isFunction(target)) {
      bol = target(...rest)
    } else {
      bol =_.includes(this.list, target)
    }
    return this.negate ? !bol : bol;
  }

  toString() {
    return this.list.join(',')
  }
}