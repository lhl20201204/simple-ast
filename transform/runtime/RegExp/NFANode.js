import { Edge } from "./Edge";

export default class NFANode {
  constructor (state) {
    this.state = state;
    this.inList = []; // 进边
    this.outList = []; // 出边
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