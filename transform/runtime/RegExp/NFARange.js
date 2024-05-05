import NFANode from "./NFANode";
import { Epsilon } from "./constant";
import { createNode } from "./util";

export default class NFARange {
  constructor(startNode, endNode) {
     this.start = startNode;
     this.end = endNode;
  }

  merge(range, ctx) {
    // 如果start， end 都为空
    if (_.isNil(this.start) && _.isNil(this.end)) {
      this.start = range.start;
      this.end = range.end;
    } else {
      // 连接一个空节点
      const left = this.end;
      const right = range.start;
      // const middle = createNode(ctx)
      // left.moveToNext(Epsilon, middle)
      // middle.moveToNext(Epsilon, right);
      left.moveToNext(Epsilon, right)
      this.end = range.end;
    }
  }

  leftJoin(acceptStr, node) {
    node.moveToNext(acceptStr, this.start);
    this.start = node;
  } 

  rightJoin(acceptStr, node) {
    this.end.moveToNext(acceptStr, node);
    this.end = node;
  }

}