import { DomHandler } from "./DomHandler";

export const ListenerMap = new Map();

export class DomEventTarget {
  addEventListener(type, cb) {
    if (!ListenerMap.has(type)) {
      ListenerMap.set(type, []);
    }
    ListenerMap.get(type).push(new DomHandler({
      target: this,
      handler: cb,
    }))
  }

  removeEventListener(type, cb) {
    if (!ListenerMap.has(type)) {
      return;
    }
    const handlerList = ListenerMap.get(type);
    const index = _.find(handlerList, c => c.equal(this, cb) )
    if (index > -1) {
      handlerList.splice(index, 1)
    }
  }
}