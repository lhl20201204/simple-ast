import _ from 'lodash';
export function isInstanceOf(left, right) {
  // if (arguments.length !== 2) {
  //   throw 'isInstanceOf 调用错误'
  // }
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

// 加快速率不继承了
export class AstJSON {
  constructor(ret) {
    Object.defineProperty(this, 'return', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: ret,
    })
  }
  set(k, v) {
    this[k] = v;
  }
}

export function copyToClipboard(text) {
  requestIdleCallback(() => {
    console.time('复制json花费时间')
    const handler = async () => {
      if (!document.hasFocus()) {
        console.log('聚焦')
        await new Promise((resolve) => {
          focuableButton.focus()
          setTimeout(resolve, 2000)
        })
      }
      navigator.clipboard.writeText(text)
      .then(() => {
        console.log(`\x1B[20;70;4m%s`, '已经复制json到粘贴板')
        console.timeEnd('复制json花费时间')
      })
      .catch((error) => {
         console.error("复制文本失败:", error);
      })
    }
    handler()
  })
}

export const debounceCopyToClipboard = _.debounce(copyToClipboard, 2000)

export const SPAN_TAG_HTML = '<span style="color:darkgray;">&lt;html&gt;</span>';


export function diffStr(origin, target) {
  let len = Math.min(origin.length, target.length);
  let ret = [], i= 0;
  while(i < len  && origin[i] === target[i]) {
    ret.push(origin[i])
    i++
  }
  return {
    same: ret.join(''),
    diff: {
      origin: origin.slice(i),
      target: target.slice(i),
    }
  }
}

export function log(x){
  console.log(x)
  return x;
}

export function PrivateIdentifierNameTransform(ast) {
  if (ast.type !== 'PrivateIdentifier') {
    throw '类型错误'
  }
  return {
    ...ast,
    type: 'Identifier',
    name: '#' + ast.name,
  }
}