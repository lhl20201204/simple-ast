import { Watchable } from "./Watchable";
let id = 0;
let debuggerId = 0;
export class Reaction {
  constructor(cb, debuggerKey = debuggerId++) {
    this.debuggerKey = debuggerKey;
    this.cb = cb;
    this.id = id++;
    this.disabled = false;
    this.parent = Reaction.currentReaction ?? null;
  }

  setParent(node) {
    this.parent = node;
  }

  isInRoot(node) {
    let t = this;
    while (t && t!== node) {
      t = t.parent;
    }
    return t === node;
  }

  static currentReactionStack = [];

  static currentWatchingStack = [false];

  static get inWatching() {
    return _.last(this.currentWatchingStack);
  }

  static get currentReaction() {
    return _.last(Reaction.currentReactionStack);
  }

  static push(instance) {
    Reaction.currentReactionStack.push(instance);
  }

  static pop() {
    return Reaction.currentReactionStack.pop();
  }

  equals(target) {
    return !this.disabled && this.cb === target.cb
  }

  disposer = () => {
    this.disabled = true;
    this.cb = null;
    Watchable.removeReaction(this);
  }

  update = () => {
    if (this.disabled) {
      return
    }
    this.cb()
  }
}

export function runInAction(cb, flag = false) {
  Reaction.currentWatchingStack.push(flag);
  try {
    return cb()
  } finally {
    Reaction.currentWatchingStack.pop()
  }
}
