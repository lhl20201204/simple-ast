export class AssertView {
  constructor(ast) {
    this.ast = ast;
  }
}

export function createAssertView(ast) {
  return new AssertView(ast);
}