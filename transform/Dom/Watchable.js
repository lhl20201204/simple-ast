import { Reaction } from "./Reaction";
import { isInstanceOf, runNextTickCallbackList } from "./util";

let id = 0;
export class Watchable {

  static #reactionListCollector = [];

  #reactionList = [];

  #readyList = [];

  #data = {};

  #debuggerKey = null;

  getDebuggerKey() {
    return this.#debuggerKey;
  }

  static #immediateList = [false];

  static get immediate() {
    return _.last(this.#immediateList)
  }

  static push(bol) {
    this.#immediateList.push(bol)
  }

  static pop() {
    return this.#immediateList.pop()
  }

  static removeReaction(x) {
    for (const reactionList of this.#reactionListCollector) {
      const index = _.findIndex(reactionList, c => c === x)
      if (index > -1) {
        reactionList.splice(index, 1);
      }
    }
  }

  callbackList = [];


  on(cb) {
    this.callbackList.push(cb);
  }

  emit(totalData) {
    this.callbackList.forEach(cb => cb(totalData))
  }

  constructor(data = {}, debuggerKey = id++) {
    Watchable.#reactionListCollector.push(this.#reactionList);
    this.#data = {...data};
    this.#debuggerKey = debuggerKey;
    for (const attr in data) {
      for (const target of [this, data]) {
        Object.defineProperty(target, attr, {
          get: () => {
            if (Reaction.inWatching) {
              this.subscribe();
            }
            let v = this.#data[attr];
            return _.isObject(v) && !isInstanceOf(v, Watchable) ? new Watchable(v, this.#debuggerKey) : v;
          },
          set: (newV) => {
            if (this.#data[attr] !== newV) {
              this.lazyNotify(() =>{
                this.#data[attr] = newV;
              }, debuggerKey +":" + attr + '=' + newV)
            }
          }
        })
      }
    }
  }

  getValue() {
    return this.#data;
  }

  copy() {
    return new Watchable(_.cloneDeep(this.#data), this.#debuggerKey);
  }

  isEqual(x) {
    if (!isInstanceOf(x, Watchable)) {
      return false
    }
    return _.isEqual(this.getValue(), x.getValue());
  }

  subscribe() {
    const reaction = Reaction.currentReaction
    if (!isInstanceOf(reaction, Reaction)) {
      return;
    }
    if (!_.find(this.#reactionList, x => x.equals(reaction))) {
      // console.log('添加监听', reaction, this);
      this.#reactionList.push(reaction)
    }
  }

  sortReaction() {
    const list = _.uniq(_.sortBy(_.flatten(Watchable.#penddingUpdateList), 'id'));
    let ret = [];
    while(list.length) {
      const x = list.shift();
      if (_.every(ret, q => !x.isInRoot(q))) {
        ret.push(x)
      }
    }
    return ret;
  }

  static #penddingUpdateList = [];

  notify() {
    Watchable.#penddingUpdateList.push(...this.#reactionList);
    this.emit(this.#data);
    // console.log('待处理', [...this.#reactionList])
    Promise.resolve().then(() => {
      if (!Watchable.#penddingUpdateList.length) {
        return;
      }
      const arr = this.sortReaction();
      runNextTickCallbackList()
      arr.forEach(c => {c.update()});
      Watchable.#penddingUpdateList.splice(0, Watchable.#penddingUpdateList.length)
    })
  }

  lazyNotify(cb, name) {
    if (Watchable.immediate) {
      cb();
      return;
    }
    this.#readyList.push([cb, name]);
    Promise.resolve().then(() => {
      const len = this.#readyList.length;
      const temp = ([...this.#readyList])
      while (this.#readyList.length) {
        const [task] = this.#readyList.shift();
        task();
      }
      if (len) {
        console.log(temp.map(c => c[1]));
        this.#readyList.splice(0, this.#readyList.length);
        this.notify();
      }
    })
  }
}

export function runInImmediate(cb) {
  Watchable.push(true);
  cb();
  Watchable.pop()
}