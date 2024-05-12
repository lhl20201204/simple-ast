import { Edge } from "./Edge";

class Api {
  setDir(bol) {
    this.isFromHeadToTail = bol;
  }

  copyInList() {
    this.tempInList = this.inList;
    this.inList = [];
  }

  copyOutList() {
    this.tempOutList = this.outList;
    this.outList = []
  }

  restoreInList() {
    this.inList = this.tempInList;
    Reflect.deleteProperty(this, 'tempInList')
  }

  restoreOutList() {
    this.outList = this.tempOutList;
    Reflect.deleteProperty(this, 'tempOutList')
  }

  get value() {
    return this.state;
  }

  get edgeGetNodeAttr() {
    return this.isFromHeadToTail ? 'end' : 'start';
  }

  get children() {
    return this.isFromHeadToTail ? this.outList : this.inList;
  }

  get parentList() {
    return !this.isFromHeadToTail ? this.outList : this.inList;
  }

  traveseChildren(cb) {
    for(const edge of this.children) {
      const node = edge[this.isFromHeadToTail ? 'end' : 'start'];
      node.setDir(this.isFromHeadToTail);
      cb(node);
    }
  }

  traveseParent(cb) {
    for(const edge of this.parentList) {
      const node = edge[this.isFromHeadToTail ? 'start' : 'end'];
      node.setDir(this.isFromHeadToTail);
      cb(node);
    }
  }

  getFarReverseCurrentDirectionAndNotMergeNode(isReverseCurrentDirection, findEndNode) {
    // 找到离当前节点最远的反方向并且入度为1的节点
    // children 是相同方向， parent 是相反方向。
    let temp = this;
    // let index = 0;
    /*
    isReverseCurrentDirection.    isFromHeadToTail
    False, false,   nodeList <-levelNode  <-root   children start
   False, true,     root  -> levelNode  ->  nodeList children end
  True, false,       levelNode <- nodeList <- root  parent end
True, true ,        root  -> nodeList -> levelNode  parent start
*/
    while(findEndNode ? _.size(isReverseCurrentDirection ? temp.parentList : temp.children) !== 0 :
    _.size(isReverseCurrentDirection ? temp.parentList : temp.children) === 1) {
      temp = (isReverseCurrentDirection ? temp.parentList : temp.children)[0][
        ((isReverseCurrentDirection && this.isFromHeadToTail)
        || (!isReverseCurrentDirection && !this.isFromHeadToTail)) ? 'start' : 'end'
      ];
      // console.log(temp, dir, _.map( dir ? temp.parentList : temp.children, 'key'));
      // if (index ++ > 10) {
      //   console.warn(_.cloneDeep(this));
      //   throw '查找反方向最远的出度节点出错'
      // }
    }

    // console.error('找到的节点', temp)
    return temp;
  }

  getMapFn(reverse) {
    return (cb, defaultValue, isReverseCurrentDirection) => {
      const l = isReverseCurrentDirection ? this.parentList : this.children
      const list = reverse ? [...l].reverse() : l;
      for(const edge of list) {
        const node = edge[(isReverseCurrentDirection && this.isFromHeadToTail)
          || (!isReverseCurrentDirection && !this.isFromHeadToTail)?'start': 'end'];
        node.setDir(this.isFromHeadToTail);
        const ret = cb(node);
        // node.setDir(origin);
        if (ret) {
          return ret;
        }
      }
      return defaultValue;
    }
  }

  forOrDefault = this.getMapFn(false);

  reverseChildrenOrderForOrDefault = this.getMapFn(true);

  map(cb) {
    const list =  this.children;
    const ret = [];
    for(const edge of list) {
      const node = edge[this.edgeGetNodeAttr];
      node.setDir(this.isFromHeadToTail);
      ret.push(cb(node))
    }
    return ret;
  }

  toString() {
    return `node{${this.value}}`
  }
}

export default class NFANode extends Api {
  constructor (state) {
    super()
    this.state = state;
    this.inList = []; // 进边
    this.outList = []; // 出边
    this.isFromHeadToTail = true;
  }

  moveToNext(acceptStr, nextNode) {
    if (!(nextNode instanceof NFANode)) {
      throw 'eee'
    }
    const edge = new Edge(this, acceptStr, nextNode);
    this.connectOut(edge);
    nextNode.connectIn(edge);
  }

  connectIn(edge) {
    if (!(edge instanceof Edge)) {
      throw 'eee'
    }
    this.inList.push(edge)
  }

  connectOut(edge) {
    if (!(edge instanceof Edge)) {
      throw 'eee'
    }
    this.outList.push(edge)
  }
}