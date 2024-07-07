import Tooltip from ".";
import { isInstanceOf } from "../../commonApi";
import { Moveable } from "./Moveable";
import { TriggerConfig } from "./TriggerConfig";

export default class Trigger extends Moveable {
  constructor(dom, position, parent, config, connector) {
    super(dom, position);
    if (!isInstanceOf(config, TriggerConfig)
      || !isInstanceOf(connector, Tooltip)) {
      throw '配置错误'
    }
    this.dom = dom;
    this.position = position;
    this.parent = parent;
    this.config = config;
    this.connector = connector;
  }

  getWidthAndHeight() {
    return this.config.getWidthAndHeight()
  }

  mouseEnterhandler = () => {
    this.connector.show();
  }

  mouseLeavehandler = () => {
    this.connector.hide();
  }

  removeClickHandler = () => {
    this.connector.hide();
    document.body.removeEventListener('click', this.removeClickHandler)
  }

  clickHandler = (e) => {
    e.stopPropagation();
    this.connector.show();
    document.body.addEventListener('click', this.removeClickHandler)
  }


  addEvent() {
    super.addEvent()
    this.parent.appendChild(this.dom)
    if (this.config.isHoverType()) {
      this.dom.addEventListener('mouseenter', this.mouseEnterhandler)
      this.dom.addEventListener('mouseleave', this.mouseLeavehandler)
    } else if (this.config.isClickType()) {
      this.dom.addEventListener('click', this.clickHandler)
    } else {
      console.warn('未处理过')
    }
  }

  removeEvent() {
    super.removeEvent()
    if (this.config.isHoverType()) {
      this.dom.removeEventListener('mouseenter', this.mouseEnterhandler)
      this.dom.removeEventListener('mouseleave', this.mouseLeavehandler)
    } else if (this.config.isClickType()) {
      this.dom.removeEventListener('click', this.clickHandler);
    }
    this.parent.removeChild(this.dom);
  }
}