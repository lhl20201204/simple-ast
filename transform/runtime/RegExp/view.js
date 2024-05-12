import NFANode from "./NFANode";

const dom = document.getElementById('nfaView')


let recId = 0;
let lindId = 0;

let maxX = -1;
let maxY = -1;

class Rect {
  constructor(x, y, text, width = 40, height = 40) {
    this.id = recId++;
    this.x = x;
    this.y = y;
    this.text = text;
    this.width = width;
    this.height = height;
    maxX = Math.max(maxX, this.x + this.width)
    maxY = Math.max(maxY, this.y + this.height)
    this.centerX = this.x + this.width / 2;
    this.centerY = this.y + this.height / 2
  }

  draw(ctx) {
    ctx.save()
    ctx.strokeStyle = 'green';
    ctx.rect(this.x, this.y, this.width, this.height)//矩形起始点的横纵坐标和宽高
    ctx.font = "20px Georgia";
    ctx.fillText(this.text, this.centerX - 10, this.centerY + 5)
    ctx.stroke();//实际绘制路径
    ctx.restore()
  }
}

class Line {
  constructor(text, x1, y1, x2, y2, key) {
    this.id = lindId++;
    this.key = key;
    this.text = text;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  draw(ctx) {
    ctx.save()
    ctx.strokeStyle = 'red';
    ctx.beginPath();//开始绘制新的路径
    ctx.moveTo(this.x1, this.y1)//路径起始坐标
    ctx.lineTo(this.x2, this.y2);//绘制直线到指定坐标点
    ctx.closePath()//闭合路径
    ctx.stroke();//实际绘制路径

    ctx.beginPath();//开始绘制新的路径
    ctx.ellipse(this.x1, this.y1, 3, 3, 0, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue'
    ctx.fill();
    ctx.font = "20px Georgia";
    ctx.save()
    const r = Math.atan((this.y2 - this.y1) / (this.x2 - this.x1))
    const len = Math.sqrt((this.y2 - this.y1) * (this.y2 - this.y1)
      + (this.x2 - this.x1) * (this.x2 - this.x1));
    const isSame = this.x1 <= this.x2 // (this.x1 - this.x2) * (this.y1 - this.y2) >= 0;
    const newLen = len - 8;
    ctx.translate(
      (this.x1 + newLen * Math.cos(r) * (this.x1 > this.x2 ? -1 : 1)),
      (this.y1 + newLen * Math.sin(r) * (isSame ? 1 : -1)));

    // if ((Math.round(this.x2) !== Math.round(this.x1 + len * Math.cos(r) * (this.x1 > this.x2 ? -1 : 1)))
    //   || (this.y2 !== this.y1 + len * Math.sin(r) * (isSame ? 1 : -1))) {
    //   console.warn([this.x1, this.y1, this.x2, this.y2], [
    //     this.x1 + len * Math.cos(r) * (this.x1 > this.x2 ? -1 : 1),
    //     this.y1 + len * Math.sin(r) * (isSame ? 1 : -1),
    //   ])
    // }

    ctx.rotate(r + (isSame ? 0 : Math.PI))
    ctx.fillText('>', 5 * Math.sin(r), 5 * Math.cos(r));
    ctx.restore()
    ctx.fillText(this.text, (this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2)
    ctx.restore()
  }
}


// function findNodeByNum(node, target) {
//   // 这里不用反向
//   if (node === target) {
//     return node;
//   }
//   for (const x of node.outList) {
//     const t = findNodeByNum(x.end, target)
//     if (t) {
//       return t;
//     }
//   }
//   return null
// }

export function splitSubTree(start, end) {
  // start， 入度为0， end 出度为0，也就是求出子树
  // 断开start 和 前面的 节点。以及end 和后面的节点。
  start.copyInList();
  end.copyOutList()
}


export function joinSubTree(start, end) {
  // start， 入度为0， end 出度为0，也就是求出子树
  // 断开start 和 前面的 节点。以及end 和后面的节点。

  start.restoreInList();
  end.restoreOutList()
}



function findNodeByNum(node, num) {
  if (node.state === num) {
    return node;
  }
  for (const x of node.outList) {
    const t = findNodeByNum(x.end, num)
    if (t) {
      return t;
    }
  }
  return null
}

function getInnerY(root, node, isFromHeadToTail) {
  // 跟伪代码不太相同，每一个节点都是双向连接的，也就是 可以往前也可以往后查找
  // isFromHeadToTail 取方向，用于后面剥离子树结果方向递归。
      // 类型保护，加ts，不然没提示难搞
  if (!(node instanceof NFANode)) {
    throw ''
  }

  // console.log('递归开始', root.value, node.value, isFromHeadToTail);

  root.setDir(isFromHeadToTail);
  node.setDir(isFromHeadToTail);

  const getLevelNode = (node) => {
    const edgelist =  node.children;
    if (!_.size(edgelist)) {
      return []
    }
    const mayBeRet = [];
    node.traveseChildren(n => {
      mayBeRet.push(...getLevelNode(n))
    })

    const uniqMayBeRet = _.uniq(mayBeRet)
    if (_.size(uniqMayBeRet) > _.size(edgelist)) {
      return uniqMayBeRet;
    }
    return node.map(c => c.value)
  }


  const mark = (node, list) => {
    let row = 1;
    const map = new Map();
    const fn = (node) => {
      if (list.includes(node.value)) {
        if (!map.has(node.value)) {
          map.set(node.value, row++)
        }
      }
      node.traveseChildren(fn)
    }
    fn(node);
    return map;
  }

  const findFirstLevelNode = (node, list, dir) => {
    // console.log('当前方向', _.cloneDeep({node, list, dir}));
    const findNode = (node, list, isReverseCurrentDirection) => {
      // console.log(node.value,_.cloneDeep({ list, node, isReverseCurrentDirection}))
      if (list.includes(node.value)) {
        return [node, true]
      }
      return node.forOrDefault((c) => {
        // console.log(c.value);
        const target = findNode(c, list, isReverseCurrentDirection);
        if (target[0]) {
          const ret = [
            target[0],
            target[1] && _.size(isReverseCurrentDirection ? c.children : c.parentList) === 1];
          return ret;
        }
      }, [null, false], isReverseCurrentDirection);
    }

    const ret = findNode(node, list, false);
    // console.log(ret)
    // 如果跟dir相同方向找到
    if (ret[0]) {
      return [...ret, dir];
    }
    // console.warn('enter')
    return [...findNode(node, list, true), !dir]
  }

  const findLastLevelNode = (node, list, dir) => {

    const findNode = (node, list, isReverseCurrentDirection) => {
      if (list.includes(node.value)) {
        return [node, true]
      }
      return node.reverseChildrenOrderForOrDefault((c) => {
        const target = findNode(c, list, isReverseCurrentDirection);
        if (target[0]) {
          return [
            target[0],
            target[1] && _.size(isReverseCurrentDirection ? c.children : c.parentList) === 1
          ];
        }
      }, [null, false], isReverseCurrentDirection)
    }

    const ret = findNode(node, list, false);
    // 如果向下找到
    if (ret[0]) {
      return [...ret, dir];
    }
    return [...findNode(node, list, true), !dir]
  }


  const list = getLevelNode(root)
  const map = mark(root, list);

  // console.log(_.cloneDeep({
  //   root,
  //   node,
  //   list,
  //   map,
  // }));


  const [firstLevelNode, notMerge, dir] = findFirstLevelNode(node, list, isFromHeadToTail);
  const [lastLevelNode, notMerge2, dir2] = findLastLevelNode(node, list, isFromHeadToTail);

  // console.log( notMerge,
  //   notMerge2, {
  //   root: root.value,
  //   node: node.value,
  //   firstLevelNode: firstLevelNode.value,
  //   lastLevelNode: lastLevelNode.value,
  // })

  if (!firstLevelNode || !lastLevelNode) {
    console.warn(_.cloneDeep({root, node, isFromHeadToTail, firstLevelNode, lastLevelNode}))
    throw '运行出错'
  }

  if (notMerge && notMerge2) {
    // 如果往下查找到一个层级节点，说明也有最后一个，
    // 

    // if (root.value === 11 && node.value === 7 && !isFromHeadToTail) {
    //   console.warn(list)
    // }
    return (
      map.get(firstLevelNode.value) + 
      map.get(lastLevelNode.value) 
    ) / 2;
  }

  if (!notMerge && !notMerge2) {
    // console.log('当前反向', node.isFromHeadToTail);
    // console.error({ root, isFromHeadToTail, isReverseCurrentDirection: node.isFromHeadToTail, node})
    const node1 = node.getFarReverseCurrentDirectionAndNotMergeNode(dir, true);
    const node2 = firstLevelNode.getFarReverseCurrentDirectionAndNotMergeNode(dir, false);


    // console.log(_.cloneDeep({ 
    //   root: root.value,
    //   node: node.value,
    //   node1: node1.value,
    //   node2: node2.value,
    //   isFromHeadToTail
    // }))
    // console.log(_.cloneDeep({node1: node1.value, node2: node2.value}))
     /*
    isReverseCurrentDirection.    isFromHeadToTail
    False, false, false  node1<-  nodeList<-node2 <-levelNode  <-root   start = node1 end = node2
   False, true,   true   root  -> levelNode ->node2  ->  nodeList -> node1   start = node2 end = node1
  True, false,    true   levelNode<-node2 <- nodeList<-node1 <- root   start = node2 end = node1
True, true ,     false   root ->node1 -> nodeList ->node2-> levelNode start = node1 end = node2
*/

    const isReverseDir = ((dir && node.isFromHeadToTail) 
    || (!dir && !node.isFromHeadToTail));


    const start = isReverseDir ? node1 : node2;
    const end = ((dir2 && node.isFromHeadToTail) 
    || (!dir2 && !node.isFromHeadToTail)) ? node2 : node1;
    // dir true node ->firstLevelNode : (node1， node2)  
    //     false firstLevelNode<-node :(node2, node1)



    const canEnsureYNode = node2;


    const tempY3 = getY(root, canEnsureYNode, isFromHeadToTail);

    splitSubTree(start, end);


    const tempY = getY(canEnsureYNode, canEnsureYNode, !isReverseDir)
    // // 拿总的去算。
    const tempY2 = getY(canEnsureYNode, node, !isReverseDir);

    joinSubTree(start, end);

    return tempY3 - (tempY - tempY2);
  }
  console.warn(notMerge, notMerge2);
  throw '未处理的情况'
}

const getYMemoMap = new Map()
function getY(root, node, isFromHeadToTail) {
  const key = [root.value, node.value, isFromHeadToTail].join('###')
  if (!getYMemoMap.has(key)) {
    getYMemoMap.set(key, getInnerY(root, node, isFromHeadToTail))
  }
  return getYMemoMap.get(key)
}


export function View(range) {
  getYMemoMap.clear();
  // console.log(getY(range.start, range.start, true))

  const ctx = dom.getContext('2d')

  let currentList = [[range.start, 0]];

  // const RowMap = new Map();

  const directionAndAttrList = [
    ['inList', 'start', 'outList', 'end', 0, new Map()],
    ['outList', 'end', 'inList', 'start', 0, new Map()]
  ]

  const rowMapFromHeadToTail = directionAndAttrList[1][5];

  const rowMapFromTailToHead = directionAndAttrList[0][5];

  const getTagNodeFn = ([direction, nodeAttr]) => {
    const fn = (node) => {
      if (!_.size(node[direction])) {
        return [];
      }
      let ret = [];
      let tempstate = [];
      for (const x of node[direction]) {
        ret.push(...fn(x[nodeAttr]))
        tempstate.push(x[nodeAttr].state)
      }
      const uniqRet = _.uniq(ret);
      if (uniqRet.length <= tempstate.length) {
        return tempstate
      }
      return uniqRet
    }
    return fn;
  }

  const getSplitNodeFn = (
    [outDir, outAttr, inDir, inAttr]
  ) => {
    const fn = (node) => {
      _.forEach(node[inDir], x => {
        x[inAttr].tempCopyList = x[inAttr][outDir];
        x[inAttr][outDir] = _.filter(x[inAttr][outDir], y => y[outAttr] !== node);
      })
    }
    return fn;
  }

  const getJoinNodeFn = ([outDir, outAttr, inDir, inAttr]) => {
    const fn = (node) => {
      _.forEach((node[inDir]), edge => {
        edge[inAttr][outDir] = edge[inAttr].tempCopyList
        Reflect.deleteProperty(edge[inAttr], 'tempCopyList')
      })
    }

    return fn
  }

  const getDfsFn = ([outDir, outAttr, inDir, inAttr, col, map]) => {
    const fn = function (node, list) {
      if (list.includes(node.state)) {
        // console.warn('设置', node.state, col)
        if (!map.has(node.state)) {
          map.set(node.state, col++);
        }
      }
      for (const x of node[outDir]) {
        fn(x[outAttr], list)
      }
    }
    return fn;
  }


  // 从尾部到头部获取最大层级节点数量
  const tagNdoeFromTailToHead = getTagNodeFn(directionAndAttrList[0]);
  // 从头部到尾部获取最大层级节点数量
  const tagNodeFromHeadToTail = getTagNodeFn(directionAndAttrList[1]);

  // 断开尾部节点
  const splitTail = getSplitNodeFn(directionAndAttrList[1]);

  // 断开头部节点
  const splitHead = getSplitNodeFn(directionAndAttrList[0]);

  // 连接尾部节点
  const joinTail = getJoinNodeFn(directionAndAttrList[1]);
  // 连接尾部节点
  const joinHead = getJoinNodeFn(directionAndAttrList[0]);



  // const last = range.end;

  // 手动断开end 节点。
  // _.forEach(last.inList, x => {
  //   x.start.tempCopyList = x.start.outList;
  //   x.start.outList = _.filter(x.start.outList, y => y.end !== last)
  // })


  // 断开头部连接
  splitHead(range.start);
  const tailToHeadList = tagNdoeFromTailToHead(range.end);
  // 恢复头部连接
  joinHead(range.start);


  // 断开尾部连接
  splitTail(range.end);
  const headToTailList = tagNodeFromHeadToTail(range.start);

  // 这里不用恢复，最终尾部是用来修正节点的。

  // 这部没问题
  // console.warn(tailToHeadList, headToTailList);

  const RowNodeStateList = _.size(tailToHeadList) > _.size(headToTailList) ?
    tailToHeadList : headToTailList;




  // let col = 1;
  // function dfs(node) {
  //   if (RowNodeStateList.includes(node.state)) {
  //     // console.warn('设置', node.state, col)
  //     if (!RowMap.has(node.state)) {
  //       RowMap.set(node.state, col++);
  //     }
  //   }
  //   for (const x of node.outList) {
  //     dfs(x.end)
  //   }
  // }

  // dfs(range.start);

  // 从头部递归找到层级节点
  const dfsFromHeadToTail = getDfsFn(directionAndAttrList[1]);

  const dfsFromTailToHead = getDfsFn(directionAndAttrList[0]);

  dfsFromHeadToTail(range.start, headToTailList);

  dfsFromTailToHead(range.end, tailToHeadList);


  const RowMap = rowMapFromHeadToTail;
  // console.log([rowMapFromHeadToTail, rowMapFromTailToHead], RowMap)

  // console.log(RowNodeStateList, RowMap)

  let debugging = false;


  function findFirstRowReverse(node) {
    // 向上查找,也就是找回根部
    if (RowNodeStateList.includes(node.state)) {
      if (debugging) {
        console.warn('findFirstRowReverse', node, RowMap.get(node.state));
      }
      return RowMap.get(node.state)
    }
    for (const x of node.inList) {
      const t = findFirstRowReverse(x.start)
      if (t > -1) {
        return t;
      }
    }
    return -1;
  }

  function findlastRowReverse(node) {
    // 向上查找,也就是找回根部
    if (RowNodeStateList.includes(node.state)) {
      if (debugging) {
        console.warn('findlastRowReverse', node, RowMap.get(node.state));
      }
      return RowMap.get(node.state)
    }
    for (const x of [...node.inList].reverse()) {
      const t = findlastRowReverse(x.start)
      if (t > -1) {
        return t;
      }
    }
    return -1;
  }


  function findFirstRow(node) {
    // 向下查找
    if (RowNodeStateList.includes(node.state)) {
      if (debugging) {
        console.warn('findFirstRow', node, RowMap.get(node.state));
      }
      return RowMap.get(node.state)
    }
    for (const x of node.outList) {
      const t = findFirstRow(x.end)
      if (t > -1) {
        return t;
      }
    }
    // console.warn('没找到，往上找')
    // 如果不包含，则网上回根部查找
    return -1;
  }

  function findLastRow(node) {
    // 向下查找
    if (RowNodeStateList.includes(node.state)) {
      if (debugging) {
        console.warn('findLastRow', node, RowMap.get(node.state));
      }
      return RowMap.get(node.state)
    }
    // 这里影响了原来的值。。。。
    for (const x of [...node.outList].reverse()) {
      const t = findLastRow(x.end)
      if (t > -1) {
        return t;
      }
    }
    return -1;
  }

  function runInHook(cb) {
    debugging = true;
    const ret = cb()
    debugging = false;
    return ret;
  }



  // console.error(runInHook(() => {
  //   const target = findNodeByNum(range.start, 13);
  //       findFirstRow(target);
  //       findLastRow(target);
  //       findFirstRowReverse(target);
  //       findlastRowReverse(target);
  //   return _.cloneDeep(target)
  // }))

  const endY = calcY(range.start);


  // console.log(endY);


  function calcY(node) {
    if ([range.end.state].includes(node.state)) {
      return endY;
    }
    // 如果包含层级节点。
    // console.log(node.state,findFirstRow(node), findLastRow(node) )
    const c = findFirstRow(node);
    if (c < 0) {
      return (findFirstRowReverse(node) + findlastRowReverse(node)) / 2;
    }
    return (c + findLastRow(node)) / 2
  }


  console.log(range)

  let y = 50;

  let x = 0;

  const instanceList = [];

  const edgeListMap = new WeakMap();

  // let max = -1;

  function createRect(...args) {
    // const index = _.last(args);
    // if (map.has(index)) {
    //   return map.get(index)
    // }

    const rect = new Rect(...args);
    // map.set(index, rect)
    return rect;
  }

  let maxCol = -1;

  const textToRectWeakMap = new WeakMap();

  function filterByInstanceList(list) {
    const ret = []
    for (const y of list) {
      const index = _.findIndex(instanceList, x => x === y)
      if (index > -1) {
        ret.push(...instanceList.splice(index, 1));
      } else {
        // console.warn('传入有误')
      }
    }
    return ret;
  }

  const totalRemoveRect = [];

  function dfsRemoveAllLineAndRect(node) {
    const oldRect = _.find(instanceList, x => x.text === node.state)
    if (oldRect) {
      const [c] = filterByInstanceList([oldRect])
      totalRemoveRect.push(oldRect);
      // console.log(node.state,'上一次缓存的', _.map([...edgeListMap.get(node)], '0.text'))
      // edgeListMap.set(node, []);
      const oldLineList = textToRectWeakMap.get(c);
      // console.log('移除掉', oldRect.text, _.map(oldLineList, 'key'))
      if (_.size(oldLineList)) {
        // console.log('移除前', _.map(_.filter(instanceList, x => (x instanceof Line)), 'key'))
        filterByInstanceList(oldLineList)
        textToRectWeakMap.set(c, [])
        // console.log('移除后', _.map(_.filter(instanceList, x => (x instanceof Line)), 'key'))
      }
      for (const x of node.outList) {
        dfsRemoveAllLineAndRect(x.end);
      }
    }
  }


  // let isFromHeadToTail = false;

  // const fixArr = []
  // const nodeStateToColMap = new Map();
  maxX = -1;
  maxY = -1;
  function dfsDraw(list, col, onlyDrawCurrent = false) {
    if (!list.length) {
      maxCol = col;
      return;
    }
    // max = Math.max(max, list.length);
    const nextList = [];
    for (const [current] of list) {
      // console.log(current.state, '------->')
      const ret = getY(range.start, current, true);
      // console.log(current.state, '<------',  ret);
      // const oldCol = nodeStateToColMap.get(current.state);
      // if (!isFromHeadToTail) {
      // nodeStateToColMap.set(current.state, col);
      // }
      // console.log([current.state,ret ])
      const rect = createRect(
        x + col * 100,
        y + 120 * ret,
        current.state);
      dfsRemoveAllLineAndRect(current)
      instanceList.push(rect);
      if (edgeListMap.has(current)) {
        const arr = edgeListMap.get(current);

        // console.log(current.state, '待生成的', _.map(arr, '0.text'));
        // 这里有问题。
        for (const [s, text] of arr) {
          if (totalRemoveRect.includes(s)) {
            continue;
          }
          const line = new Line(text, s.x + s.width,
            s.y + s.height / 2,
            rect.x + (s.x > rect.x ? rect.width : 0),
            rect.y + rect.height / 2, `${s.text} -> ${rect.text}`);
          if (!textToRectWeakMap.has(rect)) {
            textToRectWeakMap.set(rect, [])
          }
          // if (!textToRectWeakMap.has(s)) {
          //   textToRectWeakMap.set(s, [])
          // }
          textToRectWeakMap.get(rect).push(line);
          // textToRectWeakMap.get(s).push(line);
          instanceList.push(line);
        }
      }
      const endList = _.map(current.outList, x => [x.end]);
      _.forEach(current.outList, edge => {
        const x = edge.end;

        if (!edgeListMap.has(x)) {
          edgeListMap.set(x, [])
        }
        edgeListMap.get(x).push([rect, edge.acceptStr]);
      })
      nextList.push(...endList)
    }
    if (!onlyDrawCurrent) {
      dfsDraw(nextList, col + 1)
    }
  }

  dfsDraw(currentList, 1)

  // 恢复连接
  // _.forEach((range.end.inList), edge => {
  //   edge.start.outList = edge.start.tempCopyList
  //   Reflect.deleteProperty(edge.start, 'tempCopyList')
  // })

  joinTail(range.end);

  // console.log([maxCol, findTotalLeafNum(range.start)])

  // 将与最后一个终结节点连接的node 全部移动到倒数第一级
  dfsDraw(_.map(range.end.inList, x => [x.start]), maxCol - 1);

  // const fixList = [[range.end]]

  // function dfsDrawFromTailToHead(list, col) {
  //   if(!list.length) {
  //     return
  //   }
  //   // console.log('当前重渲染列表', _.map(list, '0.state'));
  //   // dfsDraw(list, col, true)
  //   const nextList = [];
  //   for(const [x] of list) {
  //     nextList.push(..._.compact(_.map(x.inList, t =>{
  //       const cNode = t.start;
  //       const oldCol = nodeStateToColMap.get(cNode.state);
  //       if (oldCol !== col -1) {
  //         // console.warn(cNode, oldCol, col - 1)
  //         return  [cNode]
  //       }
  //       return null
  //     })))
  //   }
  //   // console.log('dfsDrawFromTailToHead', _.map(nextList, '0.state'));
  //   dfsDrawFromTailToHead(nextList, col - 1)
  // }

  // isFromHeadToTail = true;
  // console.log(nodeStateToColMap);
  // dfsDrawFromTailToHead(fixList, maxCol)
  // console.log(reRenderList);


  // 从尾部开始递归 修正 错误的线。

  // console.log(instanceList);

  ctx.clearRect(-99999, -99999, 200000, 200000)
  console.log(getYMemoMap)
  // console.log(instanceList)
  // ctx.save()
  // ctx.translate(1070, 3045)
  // ctx.scale(0.14, 0.14);
  for (const x of instanceList) {
    x.draw(ctx)
  }
  // ctx.restore();

  return [maxX, maxY]
}