import AcceptStr from "./AcceptStr";
import { isInstanceOf } from "./util";

export class EdgeConfig {
  constructor(obj) {
    Object.assign(this, obj);
  }
}



export class Edge {
  constructor(start, acceptStr, end, config) {
    this.key = `${start.value} -> ${end.value}`
    this.start  = start;
    if (!isInstanceOf(acceptStr, AcceptStr)) {
      throw '传参错误'
    }
    this.acceptStr = acceptStr;
    this.end = end;
    if (!isInstanceOf(config, EdgeConfig)) {
      throw 'config 漏传'
    }
    this.config = config;
  }

  generateKey() {
    this.key = `${this.start.value} -> ${this.end.value}`
  }

  changeEnd(node) {
    this.end = node;
    this.generateKey();
    node.inList.push(this);
  }

  changeStart(node) {
    this.start = node;
    this.generateKey();
    node.outList.push(this);
  }

  get isCurve() {
    return this.config.isCurve;
  }

  get isCircular() {
    return this.config.isCircular;
  }

  removeFromConnectNode() {
    let index = _.findIndex(this.start.outList, c => c === this)
    if (index === -1) {
      throw '移除start失败'
    }
    this.start.outList.splice(index, 1);
    index = _.findIndex(this.end.inList, c => c === this)
    if (index === -1) {
      throw '移除end失败'
    }
    this.end.inList.splice(index, 1);
  }


  appendConnectNode() {
    this.start.outList.push(this);
    this.end.inList.push(this);
  }

}