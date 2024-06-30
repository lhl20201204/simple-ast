import { getScale } from "../../..";
import AstToNFA from "./AstToNfa";
import { isInstanceOf } from "./util";

const tooltipConfig = [];
// const nfaView = document.getElementById('nfaView')
let newCanvas = null;

let canvasPosition = null;

const WIDTH = 400;
const HEIGHT = 400;

class CanvasPosition {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  move(dx, dy) {
    // this.x +=dx;
    // this.y +=dy;
    if (newCanvas) {
      newCanvas.style.left = (this.x + dx) + 'px';
      newCanvas.style.top = (this.y + dy)+ 'px';
    }
  }
}

export function getPopoverCanvas() {
  return newCanvas
}

export function movePopoverCanvas(dx, dy) {
  if (!canvasPosition) {
    return;
  }
  canvasPosition.move(dx, dy);
}

export const destroyPopoverCanvas = () => {
  if (!newCanvas) {
    return;
  }
  document.body.removeChild(newCanvas);
  document.body.removeEventListener('click', destroyPopoverCanvas)
  newCanvas = null;
  canvasPosition = null;
};

class TooltipConfig {
  constructor(x, y, width, height, config) {
    this.x = x;
    this.y = y;
    this.scale = getScale();
    this.width = width;
    this.height = parseInt(height);
    this.config = config;
  }

  contain(x, y, s) {
    const scale = s / this.scale;
    // 这个判断，缩放的时候不够精确。
    const nx = x;
    const ny = y;
    // 有偏移
    // console.log(s, this.scale, [x, y], [
    //   this.x - this.width / 2 * scale,
    //   this.x + this.width /2 * scale,
    //   this.y - this.height * scale,
    //   this.y
    // ]);

    return !(nx < this.x - this.width / 2 * scale || nx > this.x + this.width /2 * scale ||
      ny < this.y - this.height * scale || ny > this.y
    )
  }


  onClick(e) {
    console.log('触发点击', this, e);
    destroyPopoverCanvas()
    newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('width', WIDTH + 'px');
    newCanvas.setAttribute('height', HEIGHT + 'px')
    newCanvas.style.position = 'absolute';
    const cx = e.clientX ;
    const cy = e.clientY;
    canvasPosition = new CanvasPosition(cx, cy)
    newCanvas.style.left = canvasPosition.x + 'px';
    newCanvas.style.top = canvasPosition.y + 'px';
    newCanvas.style.background = 'black';
    newCanvas.style.border = '1px solid red';
    document.body.appendChild(newCanvas);
    newCanvas.addEventListener('click', e => {
      e.stopPropagation();
    })
    document.body.addEventListener('click', destroyPopoverCanvas)
  }
}

export function createTooltipConfig(x, y, width, height, config) {
  return new TooltipConfig(x, y, width, height, config);
}

export function pushTooltipConfig(config) {
  if (!isInstanceOf(config, TooltipConfig)) {
    throw 'config 类型有误'
  }
  tooltipConfig.push(config)
}

export function getTooltipConfig() {
  return tooltipConfig;
}

export function clearTooltipConfig() {
  tooltipConfig.splice(0, tooltipConfig.length)
}

export function getGloabalRange(ast) {
  const range =  new AstToNFA().transfrom(ast);
  return range;
}