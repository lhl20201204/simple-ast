import CanvasContext from "../CanvasContext";
import { DomLike } from "../DomLike";

export class DivLike extends DomLike {
  update(ctx) {
    if (!CanvasContext.isInRemoving) {
      console.log('render', this.style.background, this.id);
    } else {
      // console.warn('remove', this.style.background, _.cloneDeep(this.style.getValue()))
    }
    ctx.fillStyle = this.style.background;
    ctx.fillRect(this.style.left, this.style.top, this.style.width, this.style.height)
  }
}