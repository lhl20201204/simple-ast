
export function isInstanceOf(left, right) {
  return left instanceof right;
}

let runtimeValueAstId = 0;
export class RuntimeValueAst{
  constructor(x) {
    this.id = runtimeValueAstId++
    Object.assign(this, x)
  }
}

export class EnvJSON{
  constructor(x) {
    Object.assign(this, x)
  }
}

export const SPAN_TAG_HTML = '<span style="color:darkgray;">&lt;html&gt;</span>';
