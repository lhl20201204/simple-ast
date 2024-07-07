export class SubtreeView {
  constructor(ast, config) {
    this.ast = ast;
    this.config = config;
  }

  getTooltipConfig() {
    const dom = document.createElement('div');
    dom.innerHTML = this.config.text;
    return {
      dom,
      ...this.config,
    }
  }
}

export function createSubtreeView(ast, obj) {
  return new SubtreeView(ast, obj);
}