import _ from "lodash";
import RuntimeValue, { RUNTIME_LITERAL, RuntimeRefValue } from "./RuntimeValue"
import AST from "../ast";
import parseAst from "..";
import { isUndefinedRuntimeValue } from ".";
import parseRuntimeValue from "./parseRuntimeValue";
import { AST_LITERAL, JS_TO_RUNTIME_VALUE_TYPE, OUTPUT_TYPE, RUNTIME_VALUE_TYPE } from "../constant";



const defalultTransformConfig = [
  {
    where: `
     this.type === 'Literal'
     && parent?.left?.operator === 'typeof'
    `,
    replaceConfig: [
      ['value', AST_LITERAL.function, OUTPUT_TYPE.function],
      ['raw', `'${AST_LITERAL.function}'`, `'${OUTPUT_TYPE.function}'`]
    ]
  }
]

const isProxyRuntimeValueFlag = '$__Symbol(isProxyRuntimeValueFlag)___';
function createProxyRuntimeValue(x) {
  if (!(x instanceof WrapAst)) {
    const type = JS_TO_RUNTIME_VALUE_TYPE(x)
    if (type === RUNTIME_VALUE_TYPE.object) {
      if (Reflect.get(x, isProxyRuntimeValueFlag)) {
        return x;
      }
      return new RuntimeRefValue(type, x);
    }
    if (type === RUNTIME_VALUE_TYPE.string) {
      return new RuntimeValue(type, `'${x}'`);
    }
    return new RuntimeValue(type, x);
  }

  return new Proxy(new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, {
    ...x.value,
  }), {
    get(target, p) {
      if (p  === 'get') {
        return x.get
      } else if (p === isProxyRuntimeValueFlag) {
        return true;
      } 
      // console.error('other ' + p )
      return Reflect.get(target, p)
    }
  });
}

class WrapAst {
  static ast = new AST();

  constructor(obj, { parent, transformConfig }) {
    this.parent = parent;
    this.transformConfig = transformConfig ?? defalultTransformConfig
    this.value = {}
    for(const x in obj) {
      this.value[x] = obj[x]
    }
  }

  get(attr) {
    if (attr === 'this') {
      // const rv = WrapAstToRuntimeValue(this);
      // if (rv.value.type?.value === "'Literal'") {
      //   console.warn('enter parent', rv.id, rv.get('parent'));
      // }
  
      return createProxyRuntimeValue(this)
    } else if (attr === 'parent') {
      const ret =  createProxyRuntimeValue(this.parent);
      return ret;
    } 
    // return new RuntimeRefValue()
    // console.error(attr)
    const ret = createProxyRuntimeValue(this.value[attr]);
    // console.log(attr, ret);
    return ret || createProxyRuntimeValue(this.value[attr])
  }

  parseConditon(where) {
    const ast = WrapAst.ast.setSourceCode(where).getAst()
    return parseRuntimeValue(parseAst(ast.body[0], this))
  }

  set(attr, v) {
    for(const {
      where,
      replaceConfig
    } of this.transformConfig) {
      if (
        this.parseConditon(where)
       ) {
        for(const item of replaceConfig) {
          if (attr === item[0] && v === item[1]) {
            return this.value[attr] = item[2];
          }
        }
     }
    }
    this.value[attr] = v;
  }


  toAST(level = 1) {
    const obj = {}
    for(const x in this.value) {
      let v = this.value[x]
      if (v instanceof WrapAst) {
        obj[x] = v.toAST(level + 1)
      } else {
        if (_.isArray(v)) {
          v = _.map(v, c => c instanceof WrapAst ? c.toAST(level + 1) : c)
        }
        obj[x] = v;
      }
    }
    if (level === 1) {
      console.log('预编译内置ast', obj);
    }
    return obj;
  }
}

export function transformInnerAst(ast, config = {}) {
  if (!config.parent) {
    config.parent = null;
  }
  if (!Reflect.has(ast, 'type')) {
    throw new Error('非ast结构')
  }
  const copy = new WrapAst({}, config)
  for(const x in ast) {
    let v = ast[x]
    if (_.isArray(v)) {
      v = _.map(v, c => transformInnerAst(c, {
        ...config,
        parent: copy
      }))
    } else if (_.isObject(v) && Reflect.has(v, 'type')) {
      v = transformInnerAst(v, {
        ...config,
        parent: copy
      })
    }
    copy.set(x, v)
  }
  return copy;
}
