import Tooltip from ".";
import { isInstanceOf } from "../../commonApi";
import { Moveable } from "./Moveable";
import PopoverConfig from "./PopoverConfig";

export default class Popover extends Moveable {
  constructor(
    dom,
    position,
    parent,
    config,
    connector,
  ) {
    super(dom, position);
    this.dom = dom;
    this.parent = parent;
    this.config = config;
    if (!isInstanceOf(config, PopoverConfig) ||
      !isInstanceOf(connector, Tooltip)) {
      throw '配置错误'
    }
    this.connector = connector;
  }

  getWidthAndHeight() {
    return this.config.getWidthAndHeight()
  }

  handler = (e) => {
    e.stopPropagation()
  }

  addEvent() {
    super.addEvent()
    this.dom.style.background = 'grey';
    this.parent.appendChild(this.dom);
    this.update();

    if (this.connector.isClickType()) {
      this.dom.addEventListener('click', this.handler)
    }
  }

  removeEvent() {
    super.removeEvent()
    if (this.connector.isClickType()) {
      this.dom.removeEventListener('click', this.handler)
    }
    this.parent.removeChild(this.dom)
  }
}