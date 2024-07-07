import { getCanvasTransformConfig } from "../../..";
import Tooltip from "../Tooltip";
import Popover from "../Tooltip/Popover";
import PopoverConfig from "../Tooltip/PopoverConfig";
import { PositionTransform } from "../Tooltip/PositionTransform";
import { TriggerConfig } from "../Tooltip/TriggerConfig";
import { isInstanceOf } from "./util";

const domParent = document.getElementById('nfaView_copy');

export const moveableList = [];

export function addMoveable(...item) {
  moveableList.push(...item)
}

export function createTooltip(textX, textY, width, height, acceptStr) { 
  const {tooltipMap} = window.mapObj;
  if (tooltipMap.has(acceptStr.id)) {
    const tooltip = tooltipMap.get(acceptStr.id);
    tooltip.init();
    return tooltip
  }  
   const { triggerType, dom, width: popoverWidth = 400, height:popoverHeight = 400 } = acceptStr.getTooltipConfig();
   const ret =  new Tooltip({
    dom: document.createElement('div'),
    position: new PositionTransform(textX - width / 2, textY - height ),
    parent: domParent,
    config: new TriggerConfig(width, height, triggerType),
   }, {
    dom,
    position: new PositionTransform(textX, textY, () => - popoverWidth / 2, (scale) => -popoverHeight - (height + 8) * scale),
    parent: domParent,
    config: new PopoverConfig(popoverWidth, popoverHeight)
   });
   tooltipMap.set(acceptStr.id, ret);
   return ret;
}

export function removeMoveable(item) {
  const index = _.findIndex(moveableList, c => c === item);
  // console.log('removeMoveable', item);
  if (index === -1) {
    throw '移除失败'
  }
  moveableList.splice(index, 1)
}

export function clearMoveableList() {
  const newList  = []
  for(const x of [...moveableList]) {
    if (isInstanceOf(x, Popover)) {
      newList.push(x)
    } else {
      // remove的时候删掉了， 导致for of 提前结束
      x.removeEvent();
    }
  }
  moveableList.splice(0, moveableList.length, ...newList);
}

export function renderMoveableList() {
  for(const moveable of moveableList) {
    moveable.update();
  }
}