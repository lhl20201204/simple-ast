import { Edge } from "./Edge";
import NFANode from "./NFANode";
import { Epsilon } from "./constant";
import { clearMoveableList, createTooltip, renderMoveableList } from "./tooltipRender";
import { isInstanceOf } from "./util";
const dom = document.getElementById('nfaView')


let recId = 0;
let lineId = 0;

let maxX = -1;
let maxY = -1;

const RECT_WIDTH = 40;

const COL_GAP = 100;
const ROW_GAP = 170;


let gradient = null;

class Rect {
  constructor(x, y, text, width = RECT_WIDTH, height = RECT_WIDTH) {
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
    ctx.fillStyle = 'purple'
    ctx.fillText(this.text, this.centerX - 10, this.centerY + 5)
    ctx.stroke();//实际绘制路径
    ctx.restore()
  }
}

class Line {
  constructor(text, x1, y1, x2, y2, key) {
    this.id = lineId++;
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
    // ctx.closePath()//闭合路径
    ctx.stroke();//实际绘制路径

    ctx.beginPath();//开始绘制新的路径
    ctx.ellipse(this.x1, this.y1, 3, 3, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.font = this.text === Epsilon ? '20px Georgiag': "30px Georgia";
    // ctx.restore()
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
    // ctx.scale(1, 1);
    ctx.fillStyle = 'red';
    ctx.fillText('>', 5 * Math.sin(r), 5 * Math.cos(r));
    ctx.restore()

    ctx.fillStyle = 'red';
    const textX =  (this.x1 + this.x2) / 2;
    const textY = (this.y1 + this.y2) / 2;

    const { width } = ctx.measureText(this.text.toString())
    if ( this.text.hadSubtreeView()) {
      // pushTooltipInstance(createTooltipInstance(textX, textY, width, ctx.font, this.text))
      // addMoveable()
      createTooltip(textX, textY, width, parseInt(ctx.font), this.text)
    }
    ctx.fillText(this.text, textX - width / 2, textY);
    ctx.restore()
  }
}

class CurveLine extends Line {

  constructor(edge, levelNodeStateList, ...args) {
    if (!isInstanceOf(edge, Edge)) {
      throw '初始化错误'
    }
    // 现在做的事情是将曲线改为折线，先这样了。。
    const childLen = _.size(levelNodeStateList);
    super(edge.acceptStr, ...args)

    const offsetY =  (childLen / 2) * ROW_GAP ;
    if (edge.isCurve) {
      this.strokeStyle = 'orange';
      this.middleX =  (this.x1 + this.x2) / 2;
      this.middleY = (this.y1 + this.y2) / 2 - offsetY;
    }

    if (edge.isCircular) {
      this.x2 -= RECT_WIDTH;
      this.strokeStyle = 'black';
      this.middleX =  (this.x1 + this.x2) / 2;
      this.middleY = (this.y1 + this.y2) / 2 + offsetY;
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.strokeStyle = this.strokeStyle;
    ctx.beginPath();//开始绘制新的路径
    // 改成曲线。
    ctx.moveTo(this.x1, this.y1)//路径起始坐标
    const { middleX, middleY } = this
    // ctx.bezierCurveTo(middleX, middleY, middleX, middleY, this.x2, this.y2);
    // ctx.lineTo(this.x1, middleY);
    ctx.lineTo(middleX, middleY);
    ctx.lineTo(this.x2, this.y2)
    // ctx.lineTo(this.x2, this.y2);//绘制直线到指定坐标点
    // ctx.closePath()//闭合路径
    ctx.stroke();//实际绘制路径

    ctx.beginPath();//开始绘制新的路径
    ctx.ellipse(this.x1, this.y1, 3, 3, 0, 0, 2 * Math.PI);
    ctx.font = this.text === Epsilon ? '20px Georgiag': '30px Georgiag'; 
    ctx.closePath()//闭合路径
    ctx.fill();


    
    ctx.save()
    const r = Math.atan((this.y2 - middleY) / (this.x2 - middleX))
    const len = Math.sqrt((this.y2 - middleY) * (this.y2 - middleY)
      + (this.x2 - middleX) * (this.x2 - middleX));
    const isSame = middleX <= this.x2 // (this.x1 - this.x2) * (this.y1 - this.y2) >= 0;
    const newLen = len - 8;
    ctx.translate(
      (middleX + newLen * Math.cos(r) * (middleX > this.x2 ? -1 : 1)),
      (middleY + newLen * Math.sin(r) * (isSame ? 1 : -1)));

    ctx.rotate(r + (isSame ? 0 : Math.PI));
    ctx.fillStyle = this.strokeStyle;
    ctx.fillText('>', 5 * Math.sin(r), 5 * Math.cos(r));
    ctx.restore()


    ctx.fillStyle = this.strokeStyle;
    ctx.fillText(this.text, middleX, middleY )
    ctx.restore()
  }
}

export function splitSubTree(start, end) {
  start.copyInList();
  end.copyOutList()
}

export function joinSubTree(start, end) {
  start.restoreInList();
  end.restoreOutList()
}


export function logNFANodeEdge(root) {
  const current = [];
  const listNode = [root]
  while (_.size(listNode)) {
    const node = listNode.shift()
    for (const edge of node.children) {
      current.push(edge.key)
      listNode.push(edge.end);
    }
  }
  return _.uniq(current);
}


function dfsFindNodeByNum(node, num) {
  if (node.state === num) {
    return node;
  }
  try {
    node.traveseChildren(c => {
      const t = dfsFindNodeByNum(c, num)
      if (t) {
        throw t
      }
    })
    return null
  } catch (e) {
    if (!isInstanceOf(e, NFANode)) {
      console.warn(e);
      throw '查找出错'
    }
    return e;
  }
}

function isNotSame(arr1, arr2) {
  return _.size(arr1) !== _.size(arr2) || (
    [...arr1].sort().join('#')
    !== [...arr2].sort().join('#')
  )
}

const getLevelNodeMap = new Map();

const getChildrenNodeMap = new Map();


const dfsGetChildren = (node, map) => {
  let ret = [];
  node.traveseChildren((c) => {
    ret.push(c.value, ...dfsGetChildren(c, map))
  })
  ret = _.uniq(ret);
  map.set(node.value, ret);
  return ret;
}

function judgeLevelNodeNotConnect(map, nodeValueList) {
  return _.every(nodeValueList, c =>
    _.every(map
      .get(c), t => !nodeValueList.includes(t))
  )
}

function findMergeNodeByMaxLen(root, arr, map, nodeValueList) {
  const containChildrenNodeList = _.filter(_.map(nodeValueList, c => _.filter(map.get(c),
    x => nodeValueList.includes(x))), x => _.size(x) > 0);


  if (_.size(_.uniqBy(containChildrenNodeList, c => c.join('#'))) !== 1) {
    throw '未处理的情况'
  }
  const targetNodeValue = _.get(_.find(arr, c => !isNotSame(c[1], containChildrenNodeList[0])), '0')

  return dfsFindNodeByNum(root, targetNodeValue);
}


function uniqNodeByMerge(map, nodeValueList) {
  const ret = [];
  for (const c of nodeValueList) {
    if (nodeValueList.every(t => !map.get(t).includes(c))) {
      ret.push(c)
    }
  }
  return ret;
}

function dfsGetInnerY(root, rootEnd, node, isFromHeadToTail) {
  if (!isInstanceOf(node, NFANode)) {
    throw ''
  }
  root.setDir(isFromHeadToTail);
  node.setDir(isFromHeadToTail);

  const uniqKey = `${isFromHeadToTail}:${root.value}->${rootEnd.value}`;
  if (!getChildrenNodeMap.has(uniqKey)) {
    getChildrenNodeMap.set(uniqKey, new Map())
  }
  dfsGetChildren(root, getChildrenNodeMap.get(uniqKey));
  const dfsGetLevelNode = (node, level, levelNodeMap, childrenMap) => {
    if (levelNodeMap.has(node.value)) {
      return levelNodeMap.get(node.value);
    }

    const edgelist = node.children;
    const childrenLen = _.size(edgelist)
    if (!childrenLen) {
      return []
    }
    const mayBeRet = [];
    let isDiff = childrenLen === 1;
    let last = null
    node.traveseChildren(n => {
      const childList = dfsGetLevelNode(n, level + 1, levelNodeMap, childrenMap);
      mayBeRet.push(...childList)
      if (last) {
        isDiff = isDiff || isNotSame(last, childList)
      }
      last = childList;
    })

    const uniqMayBeRet = _.uniq(mayBeRet)
    const hadConnectedNode = !judgeLevelNodeNotConnect(childrenMap, uniqMayBeRet);

    if ((level === 1 && !isDiff)
      || hadConnectedNode) {

      const mergeNode =
        hadConnectedNode ?
          findMergeNodeByMaxLen(node, [...levelNodeMap], childrenMap, uniqMayBeRet) :
          dfsFindNodeByNum(node, _.get(_.first([...levelNodeMap].filter(t => !isNotSame(t[1], uniqMayBeRet))), '0'))
      /*
        isFromHeadToTail  
             false  mergeNode <- node
             true   node -> mergeNode
      */
      const start = isFromHeadToTail ? node : mergeNode;
      const end = isFromHeadToTail ? mergeNode : node;

      const uniqKey2 = `子递归${isFromHeadToTail}:${node.value}->${mergeNode.value}`;

      if (!getLevelNodeMap.has(uniqKey2)) {
        getLevelNodeMap.set(uniqKey2, new Map())
      }

      if (!getChildrenNodeMap.has(uniqKey2)) {
        getChildrenNodeMap.set(uniqKey2, new Map())
      }
      splitSubTree(start, end)
      dfsGetChildren(node, getChildrenNodeMap.get(uniqKey2));
      const ret = dfsGetLevelNode(node, 1, getLevelNodeMap.get(uniqKey2), getChildrenNodeMap.get(uniqKey2));
      joinSubTree(start, end)

      if (hadConnectedNode) {

        const newUniqMayBeRet = uniqNodeByMerge(childrenMap, uniqMayBeRet)
        if (_.size(ret) > _.size(newUniqMayBeRet)) {
          levelNodeMap.set(node.value, ret)
          return ret;
        }
        levelNodeMap.set(node.value, newUniqMayBeRet)
        return newUniqMayBeRet
      }
      if (!hadConnectedNode && _.size(ret) > _.size(uniqMayBeRet)) {
        levelNodeMap.set(node.value, ret)
        return ret;
      }
      levelNodeMap.set(node.value, uniqMayBeRet)
      return uniqMayBeRet
    }
    if (_.size(uniqMayBeRet) > _.size(edgelist)) {
      levelNodeMap.set(node.value, uniqMayBeRet)
      return uniqMayBeRet;
    }
    const newRet = node.map(c => c.value);
    levelNodeMap.set(node.value, newRet)
    return newRet
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

  const findFirstLevelNode = (node, list) => {

    const dfsFindNode = (node, list, isReverseCurrentDirection) => {
      if (list.includes(node.value)) {
        return [node, true]
      }
      return node.forOrDefault((c) => {
        const target = dfsFindNode(c, list, isReverseCurrentDirection);
        if (target[0]) {
          const ret = [
            target[0],
            target[1]
            && _.size(isReverseCurrentDirection ? c.children : c.parentList) === 1];
          return ret;
        }
      }, [null, false], isReverseCurrentDirection);
    }

    const ret = dfsFindNode(node, list, false);
    if (ret[0]) {
      return [...ret, true];
    }
    return [...dfsFindNode(node, list, true), false]
  }

  const findLastLevelNode = (node, list) => {

    const dfsFindNode = (node, list, isReverseCurrentDirection) => {
      if (list.includes(node.value)) {
        return [node, true]
      }
      return node.reverseChildrenOrderForOrDefault((c) => {
        const target = dfsFindNode(c, list, isReverseCurrentDirection);
        if (target[0]) {
          return [
            target[0],
            target[1] && _.size(isReverseCurrentDirection ? c.children : c.parentList) === 1
          ];
        }
      }, [null, false], isReverseCurrentDirection)
    }

    const ret = dfsFindNode(node, list, false);
    if (ret[0]) {
      return [...ret, true];
    }
    return [...dfsFindNode(node, list, true), false]
  }

  if (!getLevelNodeMap.has(uniqKey)) {
    getLevelNodeMap.set(uniqKey, new Map())
  }

  const list = dfsGetLevelNode(root, 1, getLevelNodeMap.get(uniqKey), getChildrenNodeMap.get(uniqKey))
  const map = mark(root, list);


  const [firstLevelNode, notMerge, dir] = findFirstLevelNode(node, list);
  const [lastLevelNode, notMerge2, dir2] = findLastLevelNode(node, list);


  if ((!firstLevelNode || !lastLevelNode)) {
    console.warn(_.cloneDeep({notMerge, notMerge2, root, rootEnd, node, list, isFromHeadToTail, firstLevelNode, lastLevelNode }))
    throw '运行出错'
  }

  if (notMerge && notMerge2) {
    return [(
      map.get(firstLevelNode.value) +
      map.get(lastLevelNode.value)
    ) / 2, list];
  }

  if (!notMerge || !notMerge2) {
    if (dir !== dir2) {
      throw '出错'
    }
    const node1 = node.getFarReverseCurrentDirectionAndNotMergeNode(dir, true);
    const node2 = (!notMerge2 ? lastLevelNode : firstLevelNode)
      .getFarReverseCurrentDirectionAndNotMergeNode((
        !notMerge2 ? dir2 : dir), false);

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
    const canEnsureYNode = node2;

    const [tempY3] = getY(root, rootEnd, canEnsureYNode, isFromHeadToTail);
    splitSubTree(start, end);

    const [tempY] = getY(canEnsureYNode, node1, canEnsureYNode, !isReverseDir)
    const [tempY2] = getY(canEnsureYNode, node1, node, !isReverseDir);
    joinSubTree(start, end);

    return [tempY3 - (tempY - tempY2), list];
  }

  throw '未处理的情况'
}

const getYMemoMap = new Map();

function getY(root, rootEnd, node, isFromHeadToTail) {
  const key = [root.value, node.value, isFromHeadToTail].join('###')
  if (!getYMemoMap.has(key)) {
    getYMemoMap.set(key, dfsGetInnerY(root, rootEnd, node, isFromHeadToTail))
  }
  return getYMemoMap.get(key)
}

function calcY(root, rootEnd, node, isFromHeadToTail) {
  return getY(root, rootEnd, node, isFromHeadToTail)[0]
}


let debuggering = false;

const visitedMap = new Map();

const curveLines = [];

function excludeCurveLine(root) {
  if (visitedMap.has(root.state)) {
    return;
  }
  visitedMap.set(root.state, true);
  const outList = [...root.outList]
  for (const edge of outList) {
    if (edge.isCurve) {
      curveLines.push(edge);
      edge.removeFromConnectNode();
    } 
    excludeCurveLine(edge.end);
  }
}

export function View(range, noNeedRender) {
  getYMemoMap.clear();
  getLevelNodeMap.clear();
  getChildrenNodeMap.clear();
  visitedMap.clear();
  curveLines.splice(0, curveLines.length);
  clearMoveableList();
  const ctx = dom.getContext('2d');
  excludeCurveLine(range.start);


  gradient = ctx.createLinearGradient(0, 0, 0, 120);
  gradient.addColorStop(0, 'red');
  gradient.addColorStop(1, 'green');
  

  let currentList = [[range.start, 0]];

  const directionAndAttrList = [
    ['inList', 'start', 'outList', 'end', 0, new Map()],
    ['outList', 'end', 'inList', 'start', 0, new Map()]
  ]

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

  const splitTail = getSplitNodeFn(directionAndAttrList[1]);
  const joinTail = getJoinNodeFn(directionAndAttrList[1]);

  splitTail(range.end);

  console.log(range, debuggering && logNFANodeEdge(range.start))

  let y = 50;

  let x = 0;

  const instanceList = [];

  const edgeListMap = new WeakMap();

  const rectMap = new Map();

  function createRect(x, y, state) {
    const rect = new Rect(x, y, state);
    rectMap.set(state, rect);
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
        throw '出错'
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
      const oldLineList = textToRectWeakMap.get(c);
      if (_.size(oldLineList)) {
        filterByInstanceList(oldLineList)
        textToRectWeakMap.set(c, [])

      }
      for (const x of node.outList) {
        dfsRemoveAllLineAndRect(x.end);
      }
    }
  }

  maxX = -1;
  maxY = -1;
  function dfsDraw(list, col, onlyDrawCurrent = false) {
    if (!list.length) {
      maxCol = col;
      return;
    }
    const nextList = [];
    for (const [current] of list) {
      const ret = calcY(range.start, range.end, current, true);
      const rect = createRect(
        x + col * COL_GAP,
        y + ROW_GAP * ret,
        current.state);
      dfsRemoveAllLineAndRect(current)
      instanceList.push(rect);
      if (edgeListMap.has(current)) {
        const arr = edgeListMap.get(current);
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
          textToRectWeakMap.get(rect).push(line);
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

  joinTail(range.end);
  dfsDraw(_.map(range.end.inList, x => [x.start]), maxCol - 1);

  const totalLevelMap = getLevelNodeMap.get('true:' + range.start.state + '->' + range.end.state);

  for (const curveLine of curveLines) {
    const s = rectMap.get(curveLine.start.state);
    const rect = rectMap.get(curveLine.end.state);
    // const firstLevelMap = getLevelNodeMap.get('true:' + range.start.state + '->' + range.end.state);
    const levelNodeStateList = totalLevelMap.get(curveLine.isCircular ? curveLine.end.state :  curveLine.start.state );
    const cl = new CurveLine(curveLine, levelNodeStateList, s.x + s.width,
      s.y + s.height / 2,
      rect.x + (s.x > rect.x ? rect.width : 0),
      rect.y + rect.height / 2, `${s.text} -> ${rect.text}`)
    maxY = Math.max(maxY, cl.middleY)
    instanceList.push(cl); 
    curveLine.appendConnectNode();
  }

  ctx.clearRect(-99999, -99999, 200000, 200000)
  if (!noNeedRender) {
    for (const x of instanceList) {
      x.draw(ctx)
    }
    renderMoveableList()
  }
  return [maxX, maxY, instanceList]
}