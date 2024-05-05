const dom = document.getElementById('nfaView')


class Rect {
  constructor(x, y, text, width = 40, height = 40) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.width = width;
    this.height = height;
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








export function View(range) {

  const ctx = dom.getContext('2d')

  let currentList = [[range.start, 0]];

  const RowMap = new Map();

  function tagNode(node) {
    if (!_.size(node.outList)) {
      return [];
    }
    let ret = [];
    let tempstate = [];
    for (const x of node.outList) {
      ret.push(...tagNode(x.end))
      tempstate.push(x.end.state)
    }
    const uniqRet = _.uniq(ret);
    if (uniqRet.length <= tempstate.length) {
      return tempstate
    }
    return uniqRet
  }

  const last = range.end;

  // 手动断开end 节点。
  _.forEach(last.inList, x => {
    x.start.tempOutList = x.start.outList;
    x.start.outList = _.filter(x.start.outList, y => y.end !== last)
  })

  const RowNodeStateList = tagNode(range.start);

  let col = 1;
  function dfs(node) {
    if (RowNodeStateList.includes(node.state)) {
      // console.warn('设置', node.state, col)
      RowMap.set(node.state, col++);
    }
    for (const x of node.outList) {
      dfs(x.end)
    }
  }

  dfs(range.start);

  console.log(RowNodeStateList, RowMap)

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


  // console.error(runInHook(() => {
  //   const target = findNodeByNum(range.start, 13);
  //       findFirstRow(target);
  //       findLastRow(target);
  //       findFirstRowReverse(target);
  //       findlastRowReverse(target);
  //   return _.cloneDeep(target)
  // }))

  const endY = calcY(range.start);

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
    return (c+ findLastRow(node)) / 2
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
    for(const y of list) {
      const index = _.findIndex(instanceList, x => x === y)
      if (index > -1) {
        ret.push(...instanceList.splice(index, 1));
      } else {
        console.warn('传入有误')
      }
    }
    return ret;
  }


  let isFromHeadToTail = false;

  // const fixArr = []
  const nodeStateToColMap = new Map();
  
  function dfsDraw(list, col, onlyDrawCurrent = false) {
    if (!list.length) {
      maxCol = col;
      return;
    }
    // max = Math.max(max, list.length);
    const nextList = [];
    for (const [current] of list) {
      const ret = calcY(current)
      if (!isFromHeadToTail) {
        nodeStateToColMap.set(current.state, col);
      }
      // console.log([current.state,ret ])
      const rect = createRect(
        x + col * 100,
        y + 120 * ret,
        current.state);
        const oldRect = _.find(instanceList, x => x.text === current.state)
      if (oldRect) {
        const [c] = filterByInstanceList([oldRect])
        const oldLineList = textToRectWeakMap.get(c);
        if (_.size(oldLineList)) {
          filterByInstanceList(oldLineList)
        }
      }
      instanceList.push(rect);
      if (edgeListMap.has(current)) {
        const arr = edgeListMap.get(current);
        for (const [s, text] of arr) {
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

  // 恢复连接
  _.forEach((range.end.inList), edge => {
    edge.start.outList = edge.start.tempOutList
    Reflect.deleteProperty(edge.start, 'tempOutList')
  })

  // console.log([maxCol, findTotalLeafNum(range.start)])

  // 将与最后一个终结节点连接的node 全部移动到倒数第一级
  dfsDraw(_.map(range.end.inList, x => [x.start]), maxCol - 1);

  const fixList = [[range.end]]

  function dfsDrawFromTailToHead(list, col) {
    if(!list.length) {
      return
    }
    console.log('当前重渲染列表', _.map(list, '0.state'));
    // dfsDraw(list, col, true)
    const nextList = [];
    for(const [x] of list) {
      nextList.push(..._.compact(_.map(x.inList, t =>{
        const cNode = t.start;
        const oldCol = nodeStateToColMap.get(cNode.state);
        if (oldCol !== col -1) {
          // console.warn(cNode, oldCol, col - 1)
          return  [cNode]
        }
        return null
      })))
    }
    console.log('dfsDrawFromTailToHead', _.map(nextList, '0.state'));
    dfsDrawFromTailToHead(nextList, col - 1)
  }

  isFromHeadToTail = true;
  console.log(nodeStateToColMap);
  // dfsDrawFromTailToHead(fixList, maxCol)
  // console.log(reRenderList);


  // 从尾部开始递归 修正 错误的线。

  ctx.clearRect(0, 0, 2000, 1000)
  for (const x of instanceList) {
    x.draw(ctx)
  }

}