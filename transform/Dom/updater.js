import { FLAG } from "./constant";

export class Updater {
  #flag = FLAG.UpdateChildrenAndStyle;

  getFlag() {
    return this.#flag;
  }

  updateFlag(flag) {
    this.#flag = flag
  }

  addFlag(flag) {
    this.#flag |= flag;
  }

  removeFlag(flag) {
    this.#flag &= (~(flag))
  }

  containFlag(flag) {
    return (this.#flag & flag) === flag;
  }

  needUpdate() {
    return this.#flag !== FLAG.NoUpdate
  }
}