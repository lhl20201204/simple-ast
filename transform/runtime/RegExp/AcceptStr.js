import { SubtreeView } from "./AssertView";
import { isInstanceOf } from "./util";

let id = 0;
export default class AcceptStr{
  constructor(value, negate = false, subtreeView = null) {
    if (!_.isArray(value)) {
      this.list = [value]
    } else {
      this.list = value;
    }
    this.id = id ++;
    this.negate = negate;
    if (!_.isNil(subtreeView) && !isInstanceOf(subtreeView, SubtreeView)) {
      throw 'subtreeView 类型错误'
    }
    this.subtreeView = subtreeView;
  }

  hadSubtreeView() {
    return isInstanceOf(this.subtreeView, SubtreeView);
  }

  getTooltipConfig() {
    return this.hadSubtreeView() ? this.subtreeView.getTooltipConfig() :{}
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