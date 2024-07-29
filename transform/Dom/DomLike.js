import { autorun } from "./observer";
import { Collectable } from "./Collectable";
import { isInstanceOf } from "./util";
import { Watchable } from "./Watchable";
import { FLAG } from "./constant";

export class DomLike extends Collectable {

  constructor(styleConfig) {
    super();
    this.style = isInstanceOf(styleConfig, Watchable) ? styleConfig : new Watchable(styleConfig, this.id);
    this.style.on(() => {
      this.updater.addFlag(FLAG.UpdateStyle);
    })
  }

  update() {
    console.warn('未实现update函数');
  }

  render(ctx) {
    if (this.updater.containFlag(FLAG.UpdateStyle)) {
      this.disposer()
      this.disposer = autorun(() => {
        if (this.updater.containFlag(FLAG.UpdateStyle)) {
          this.update(ctx);
          this.updater.removeFlag(FLAG.UpdateStyle)
        }
      }, '组件' + this.id + '_style')
    }

    if (this.updater.containFlag(FLAG.UpdateChildren)) {
      this.disposerChildren()
      this.disposerChildren = autorun(() => {
        if (this.updater.containFlag(FLAG.UpdateChildren)) {
          for (const x of this.children) {
            if (x.updater.needUpdate()) {
              x.render(ctx);
            }
          };
          this.updater.removeFlag(FLAG.UpdateChildren)
        }
      }, '组件' + this.id + '_children')
    }

  }
}