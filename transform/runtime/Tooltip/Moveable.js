import { getCanvasTransformConfig } from "../../..";
import { isInstanceOf } from "../../commonApi";
import { addMoveable, removeMoveable } from "../RegExp/tooltipRender";
import { PositionTransform } from "./PositionTransform";

export class Moveable {
  constructor (dom, position) {
    this.dom = dom;
    this.dom.style.position = 'absolute';
    this.dom.style.zIndex = 9999;
    this.dom.style.pointerEvents = 'auto';
    if (!isInstanceOf(position, PositionTransform)) {
      throw '配置错误'
    }
    this.position = position;
  }

  update() {
    const { totalScale, relatimeTotalTranslateX, relatimeTotalTranslateY } = getCanvasTransformConfig()
    this.position.update(totalScale,relatimeTotalTranslateX, relatimeTotalTranslateY)
    this.dom.style.left = this.position.x + 'px';
    this.dom.style.top = this.position.y + 'px';
    const { width, height } = this.getWidthAndHeight()
    this.dom.style.width = width + 'px';
    this.dom.style.height = height + 'px';
  }

  addEvent() {
    addMoveable(this)
  }

  removeEvent() {
    removeMoveable(this);
  }
}