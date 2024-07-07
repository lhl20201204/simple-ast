import Popover from "./Popover";
import Trigger from "./Trigger";

export default class Tooltip {
  constructor(triggerConfig, popoverConfig) {
    this.trigger = new Trigger(triggerConfig.dom, triggerConfig.position, triggerConfig.parent, triggerConfig.config, this);
    this.popover = new Popover(popoverConfig.dom, popoverConfig.position, popoverConfig.parent, popoverConfig.config, this);
    this.init();
  }

  init() {
    this.trigger.addEvent()
  }

  isClickType() {
    return this.trigger.config.isClickType()
  }

  show() {
    this.popover.addEvent()
  }

  hide() {
    this.popover.removeEvent()
  }
}