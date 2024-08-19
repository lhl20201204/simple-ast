
// 

const copyAttr = ['fillStyle'];
const transparent = 'transparent';
export default class CanvasContext {
  constructor (ctx) {
    this.ctx = ctx;
    this.pendingColorMap = new Map();
    this.fillStyle = '#000';
    this.isBatchUpdating = false;
    this.copyObjStack = [_.pick(this,copyAttr)];
    this.minRectZoomList = [];
    this.relatimeColorMap = new Map();
  }

  static DomIdList = [];

  static removeFlagList = [];

  static push(id) {
    this.DomIdList.push(id)
  }

  static get currentId() {
    return _.last(this.DomIdList)
  }

  static runInRemove(cb, id) {
    this.removeFlagList.push(true)
    const ret = this.runInContext(cb ,id)
    this.removeFlagList.pop()
    return ret;
  }

  static runInContext(cb, id) {
    this.push(id)
    const ret = cb()
    this.pop()
    return ret;
  }

  static pop() {
    return this.DomIdList.pop()
  }

  static get isInRemoving() {
    return _.size(this.removeFlagList) > 0;
  }

  recordColor(x, y, c) {
    if (!this.relatimeColorMap.has(x)) {
      this.relatimeColorMap.set(x, new Map())
    }
    const yMap = this.relatimeColorMap.get(x);
    if (!yMap.has(y)) {
      yMap.set(y, []);
    }
    const colorStack = yMap.get(y);
    colorStack.push(c);
  }

  getLastRenderColor(x, y) {
    return this.relatimeColorMap.get(x)?.get(y)
  }

  batchUpdate() {
    // 进行批量更新
    const list = [...this.minRectZoomList];
    this.minRectZoomList.splice(0 , this.minRectZoomList.length);
    //TODO 根据颜色合并矩形区间， 找出最小的绘制次数, 先简单做，单个像素绘制。
    const visitedMap = new Map();
    for(const [x, y, w, h] of list) {
        for(let i = x; i<= x + w; i++) {
          for(let j=y; j<= y + h; j++) {
            const key = i + '#' + j;
            if (!visitedMap.has(key)) {
              const color = this.getPendingColor(i, j);
              if (!_.isNil(color)) {
                if (color !== this.getLastRenderColor(i, j)) {
                  this.ctx.save()
                  this.ctx.fillStyle = color;
                  this.ctx.fillRect(i, j, 1, 1);
                  this.recordColor(i, j, color)
                  this.ctx.restore()
                }
              } else {
                this.ctx.clearRect(i, j, 1, 1);
                this.recordColor(i, j, transparent)
              }
              visitedMap.set(key, true);
            }
          }
        }
      
    }

  }

  notify(x, y, w, h) {
    this.isBatchUpdating = true;
    this.minRectZoomList.push([x, y, w, h]);
    Promise.resolve().then(() => {
      if (this.isBatchUpdating) {
        this.batchUpdate()
        this.isBatchUpdating = false;
      }
    })
  }

  save() {
    this.copyObjStack.push(_.pick(this,copyAttr))
  }

  restore() {
    const last = this.copyObjStack.pop();
    for(const attr of copyAttr) {
      this[attr] = last[attr];
    }
  }

  getPendingColor(x, y) {
    return _.last(this.pendingColorMap.get(x).get(y))?.[0];
  }

  pushColor(x, y, color) {
    if (!this.pendingColorMap.has(x)) {
      this.pendingColorMap.set(x, new Map())
    }
    const yMap = this.pendingColorMap.get(x);
    if (!yMap.has(y)) {
      yMap.set(y, []);
    }
    const colorStack = yMap.get(y);
    colorStack.push([color, CanvasContext.currentId]);
  }

  removeColor(x, y) {
    const currentId = CanvasContext.currentId;
    const colorStack = this.pendingColorMap.get(x).get(y);
    const index = colorStack.findIndex(c => c[1] === currentId);
    if (index > -1) {
      colorStack.splice(index, 1);
    } else {
      console.warn('移除失败')
    }
  }

  fillRect(x, y, w, h) {
    // 四个点分别为， (x, y) (x + w, y) (x, y+ h) (x+w, y + h)
    const isRemoveing = CanvasContext.isInRemoving;
    // console.log(isRemoveing, x, y, w, h);
    // if (isRemoveing) {
    //   console.error(CanvasContext.currentId, _.cloneDeep(this.pendingColorMap));
    // }
    this.notify(x, y, w, h)
    for(let i = x; i<= x + w; i++) {
      for(let j=y; j<= y + h; j++) {
        if (isRemoveing) {
          this.removeColor(i, j)
        } else {
          this.pushColor(i, j, this.fillStyle);
        }
      }
    }
  }
}