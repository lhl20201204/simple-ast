import { FLAG, FLAG2TEXT } from "./constant";
import { DomEventTarget } from "./DomEventTarget";
import { runInAction } from "./Reaction";
import { Updater } from "./updater";
import { runInImmediate } from "./Watchable";
import { WatchableChildren } from "./WatchableChildren";
let innerId = 0;

function traverseUpdateFlag(node, f) {
  runInAction(() => {
    const run = (node, f) => {
      node.updater.updateFlag(f);
      for (const x of node.children) {
        run(x, f);
      }
    }
    run(node, f) 
  })
}

function BubbleAddFlag(node, f) {
  runInAction(() => {
    const run = (node, f) => {
      node.updater.addFlag(f);
      if (node.parentNode) {
        run(node.parentNode, f);
      }
    }
    run(node, f)
  })
}

export class Collectable extends DomEventTarget {
  id = innerId++;
  
  parentNode = null;

  innerChildren = new WatchableChildren({}, this.id);

  updater = new Updater();

  mounted = false;

  get flag() {
    return this.updater.getFlag();
  }

  get actionName() {
    return FLAG2TEXT[this.flag]
  }

  setParentNode(node) {
    if (!node) {
      this.disposer();
      this.disposerChildren();
      traverseUpdateFlag(this, FLAG.NoUpdate);
    } else {
      traverseUpdateFlag(this, FLAG.UpdateChildrenAndStyle);
    }
    const temp = _.compact([this.parentNode, node]);
    this.parentNode = node;
    _.forEach(temp, q => BubbleAddFlag(q, FLAG.UpdateChildren))
  }

  disposer = () => { 
    this.mounted = true;
  };

  disposerChildren = () => {};

  get children() {
    return this.innerChildren.current;
  }

  appendChild(...nodeList) {
    _.forEach(nodeList, node => {
      if (node.parentNode) {
        runInImmediate(() => {
          node.parentNode.removeChild(node);
        })
      }
      let t = this;
      while (!!t && t !== node) {
        t = t.parentNode;
      }
      if (!t) {
        if (!this.innerChildren.includes(node)) {
          this.innerChildren.push(node)
          node.setParentNode(this)
        }
      } else {
        throw '添加错误'
      }
    })
  }

  removeChild(...nodeList) {
    for (const node of nodeList) {
      const index = this.innerChildren.findIndex(c => c === node);
      if (index === -1) {
        throw '移除失败'
      }
      const x = this.innerChildren.splice(index, 1);
      if (x[0]) {
        x[0].setParentNode(null)
      }
    }
  }
}