
export function isInstanceOf(left, right) {
  return left instanceof right;
}

export function getJsTypeOf(s) {
  return typeof s;
}

export function isJsSymbolType(s) {
  return typeof s === 'symbol';
}

export function stringFormat(s) {
  return getJsTypeOf(s) === 'symbol' ? s.toString() : s;
}

let runtimeValueAstId = 0;

class Merge{
  constructor(x) {
    Object.assign(this, x);
  }
}

export class RuntimeValueAst extends Merge{
  constructor(...args) {
    super(...args)
    this.id = runtimeValueAstId++
  }
}

let useRuntimeValueAstId = 0;
export class UseRuntimeValueAst extends Merge{
  constructor(...args) {
    super(...args)
    this.id = useRuntimeValueAstId++
  }
}

let getRuntimeValueAstId = 0;
export class GetRuntimeValueAst extends Merge{
  constructor(...args) {
    super(...args)
    this.id = getRuntimeValueAstId++
  }
}

// 加快速率不继承了
export class EnvJSON {
  constructor(x) {
    Object.assign(this, x)
  }
}

export const SPAN_TAG_HTML = '<span style="color:darkgray;">&lt;html&gt;</span>';
