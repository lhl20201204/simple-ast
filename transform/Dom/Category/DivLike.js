import { DomLike } from "../DomLike";

export class DivLike extends DomLike {
  update(ctx) {
    console.log('render', this.style.background, this.id);
    ctx.save()
    ctx.fillStyle = this.style.background;
    ctx.fillRect(this.style.left, this.style.top, this.style.width, this.style.height)
    ctx.restore()
  }
}