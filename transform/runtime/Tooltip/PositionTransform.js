export class PositionTransform {
  constructor (canvasX, canvasY, getOffsetX = null, getOffsetY = null) {
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.getOffsetX = getOffsetX;
    this.getOffsetY = getOffsetY;
  }

  update(scale, translateX, translateY) {
    this.x = this.canvasX * scale + translateX + (this.getOffsetX?.(scale, translateX, translateY)  ?? 0);
    this.y = this.canvasY * scale + translateY + (this.getOffsetY?.(scale, translateX, translateY) ?? 0)
  }
}