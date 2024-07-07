import { getCanvasTransformConfig } from "../../..";
import { Dimensions } from "./Dimensions";

export class TriggerConfig extends Dimensions{
  constructor (width, height, triggerType) {
    super(width, height)
    this.triggerType = triggerType;
  }

  isHoverType() {
    return this.triggerType === 'hover';
  }

  isClickType() {
    return this.triggerType === 'click';
  }

  getScale() {
    const { totalScale } = getCanvasTransformConfig();
    return totalScale;
  }
}