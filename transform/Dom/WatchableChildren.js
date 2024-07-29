import { Watchable } from "./Watchable";

export class WatchableChildren extends Watchable {

  innerCurrent = []

  relatimeCurrent = []

  get current() {
    this.subscribe()
    return this.innerCurrent;
  }

  includes(node) {
    return _.includes(this.relatimeCurrent, node)
  }

  findIndex(cb) {
    return this.relatimeCurrent.findIndex(cb);
  }

  push(...node) {
    this.relatimeCurrent.push(...node)
    this.lazyNotify(() => {
      this.innerCurrent.push(...node)
    }, this.getDebuggerKey() + '->appendChild->' + (node.map(c => c.id).join(',')))
  }

  splice(a, b, ...c) {
    const ret = this.relatimeCurrent.splice(a, b, ...c)
    this.lazyNotify(() => {
      this.innerCurrent.splice(a, b, ...c)
    }, this.getDebuggerKey() + '->removeChild->' + (ret.map(c => c.id).join(',')))
    return ret;
  }
}