import NFANode from "./NFANode";
import { Epsilon } from "./constant";
import { createNode, getBasicEdgeConfig, getCircularConfig, getCurveConfig, isInfinity } from "./util";

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
      left.moveToNext(Epsilon, right, getBasicEdgeConfig())
      this.end = range.end;
    }
  }

  leftJoin(acceptStr, node) {
    node.moveToNext(acceptStr, this.start, getBasicEdgeConfig());
    this.start = node;
  }

  rightJoin(acceptStr, node) {
    this.end.moveToNext(acceptStr, node, getBasicEdgeConfig());
    this.end = node;
  }

  deepClone(ctx) {
    // 复制节点网络。
    const root = createNode(ctx);
    const visitedMap = new Map();
    const bolMap = new Map();
    visitedMap.set(this.start.state, root);
    const dfsCloneDeep = (oldNode, newNode) => {
      if (bolMap.has(oldNode.state)) {
        return;
      }
      bolMap.set(oldNode.state, true);
      for (const edge of oldNode.outList) {
        const nextOldNode = edge.end;
        const hasVisited = visitedMap.has(nextOldNode.state);
        if (!hasVisited) {
          visitedMap.set(nextOldNode.state, createNode(ctx));
        }
        const nextNewNode = visitedMap.get(nextOldNode.state);
        newNode.moveToNext(edge.acceptStr, nextNewNode, edge.config);
        dfsCloneDeep(nextOldNode, nextNewNode);
      }
    }
    dfsCloneDeep(this.start, root);
    return new NFARange(root, visitedMap.get(this.end.state));
  }

  joinQuantifier(ctx, ast) {
    if (ast.min === 0 && ast.max === 1 && ast.greedy) {
      this.leftJoin(Epsilon, createNode(ctx))
      this.rightJoin(Epsilon, createNode(ctx));
      this.start.moveToNext(Epsilon, this.end, getCurveConfig());
      return;
    }

    if (ast.min === 0 && isInfinity(ast.max) && ast.greedy) {
      // console.warn('*', ast);
      this.leftJoin(Epsilon, createNode(ctx))
      this.rightJoin(Epsilon, createNode(ctx));
      this.start.moveToNext(Epsilon, this.end, getCurveConfig());
      this.end.moveToNext(Epsilon, this.start, getCircularConfig());
      return;
    }

    if (ast.min === 1 && isInfinity(ast.max) && ast.greedy) {
      this.leftJoin(Epsilon, createNode(ctx))
      this.rightJoin(Epsilon, createNode(ctx));
      this.end.moveToNext(Epsilon, this.start, getCircularConfig());
      // console.warn('+', ast, _.cloneDeep(this));
      return;
    }

    if (ast.min >= 0 && ast.greedy) {
      let x = 0;
      const origin = _.cloneDeep(this);
      let temp = this.start;
      while (++x < ast.max) {
        const next = origin.deepClone(ctx);
        // console.log([_.cloneDeep(next), _.cloneDeep(origin)], 'cp')
        if (x === ast.min) {
          temp = next.start;
        }
        this.end.moveToNext(Epsilon, next.start, getBasicEdgeConfig());
        this.end = next.end;
      }
      temp.moveToNext(Epsilon, this.end, getCurveConfig());
      // console.warn(`{${ast.min},${ast.max}}`, ast, _.cloneDeep(this));
      return
    }

    console.log(ast)
    throw '未处理的情况'
  }

}