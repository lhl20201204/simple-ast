export class Dimensions {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getWidthAndHeight() {
    const scale = this.getScale?.() ?? 1;
    return {
      width: this.width * scale,
      height: this.height * scale,
    }
  }
}