import _ from "lodash";
import RuntimeValue, { RUNTIME_LITERAL, RuntimeRefValue } from "./RuntimeValue"
import AST from "../ast";
import parseAst from "..";
import { isUndefinedRuntimeValue } from ".";
import parseRuntimeValue from "./parseRuntimeValue";
import { AST_LITERAL, DEBUGGER_DICTS, JS_TO_RUNTIME_VALUE_TYPE, OUTPUT_TYPE, RUNTIME_VALUE_TYPE } from "../constant";
import generateCode from "../Generate";
import { RuntimeValueAst, isInstanceOf } from "../../commonApi";



export const defalultTransformConfig = [
  {
    where: `
     this.type === 'Literal'
     && parent?.left?.operator === 'typeof'
    `,
    condition: function(_this) {
               return (_this.get('type') === 'Literal'
               && _this.get(['parent', 'left', 'operator']) === 'typeof')},
    replaceConfig: [
      ['value', AST_LITERAL.function, OUTPUT_TYPE.function],
      ['raw', `'${AST_LITERAL.function}'`, `'${OUTPUT_TYPE.function}'`],
      ['value', AST_LITERAL.undefined, OUTPUT_TYPE.undefined],
      ['raw', `'${AST_LITERAL.undefined}'`, `'${OUTPUT_TYPE.undefined}'`]
    ]
  }
]

const isProxyRuntimeValueFlag = '$__Symbol(isProxyRuntimeValueFlag)___';
function createProxyRuntimeValue(x) {
  if (!isInstanceOf(x , WrapAst)) {
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

  const xGet = x.get.bind(x);
  return new Proxy(new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, {
    ...x.value,
  }), {
    get(target, p) {
      if (p  === 'get') {
        return xGet
      } else if (p === isProxyRuntimeValueFlag) {
        return true;
      } 
      // console.error('other ' + p )
      return Reflect.get(target, p)
    }
  });
}

export class WrapAst {
  static ast = new AST();

  constructor(obj, { parent, transformConfig, wrapRuntimeValue }) {
    this.parent = parent;
    this.transformConfig = transformConfig ?? []
    this.wrapRuntimeValue = wrapRuntimeValue ?? false;
    this.value = {}
    for(const x in obj) {
      this.value[x] = obj[x]
    }
  }

  get(attr) {
    if (Array.isArray(attr)) {
      let o = this
      for(const t of attr) {
        if (!isInstanceOf(o , WrapAst)) {
          return undefined;
        }
        o = o.get(t)
      }
      return o
    }
    if (attr === 'this') {
      // const rv = WrapAstToRuntimeValue(this);
      // if (rv.value.type?.value === "'Literal'") {
      //   console.warn('enter parent', rv.id, rv.get('parent'));
      // }
      // console.log(this.wrapRuntimeValue);
      return  !this.wrapRuntimeValue ? this : createProxyRuntimeValue(this)
    } else if (attr === 'parent') {
      const ret = !this.wrapRuntimeValue ? this.parent : createProxyRuntimeValue(this.parent);
      return ret;
    } 
    // return new RuntimeRefValue()
    // console.error(attr)
    // console.warn(this.wrapRuntimeValue, this)
    const ret = !this.wrapRuntimeValue ? this.value[attr] : createProxyRuntimeValue(this.value[attr]);
    // console.log(attr, ret);
    return ret 
  }

  parseConditon(where) {
    console.log('handle-->')
    // console.error(where)
    const ast = WrapAst.ast.setSourceCode(where).getAst()
    // console.error(ast.body[0])
    const ret = parseRuntimeValue(parseAst(ast.body[0], this))
    if (ret) {
      console.error(ret);
    }

    return ret;
  }

  set(attr, v) {
    if (this.transformConfig.length) {
      for(const {
        where,
        condition,
        replaceConfig
      } of this.transformConfig) {
        if (
          condition(this)
         ) {
          // console.error('---进来更改值----' + where)
          for(const item of replaceConfig) {
            if (attr === item[0] && v === item[1]) {
              return this.value[attr] = item[2];
            }
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
      if (isInstanceOf(v,  WrapAst)) {
        obj[x] = v.toAST(level + 1)
      } else {
        if (Array.isArray(v)) {
          v = _.map(v, c => isInstanceOf(c , WrapAst) ? c.toAST(level + 1) : c)
        }
        obj[x] = v;

        // if (obj[x] instanceof RuntimeValueAst) {
        //   console.error('RuntimeValueAst TOAST')
        // }
      }
    }
    if (level === 1) {
      // console.groupCollapsed('预编译内置ast')
      // console.log(obj);
      // console.log(generateCode(obj, { [DEBUGGER_DICTS.isTextMode]: true }));
      // console.groupEnd()
    }
    return obj;
  }
}

export function getWrapAst(ast, config = {}) {
  if (!config.parent) {
    config.parent = null;
  }
  if (!config.weakMap) {
    config.weakMap = new WeakMap();
  }
  // const weakMap = config.weakMap;
  if (!Reflect.has(ast, 'type')) {
    console.error(ast);
    throw new Error('非ast结构')
  }
  // if (weakMap.has(ast)) {
  //   console.error('已经访问过')
  // }

  if (isInstanceOf(ast, RuntimeValueAst)) {
    // console.error(ast, new WrapAst(ast, config));
    const ret = new WrapAst(ast, config);
    // weakMap.set(ast, ret)
    return ret;
  }
  const copy = new WrapAst({}, config)
  // weakMap.set(ast, copy)
  for(const x in ast) {
    let v = ast[x]
    if (_.isArray(v)) {
      v = _.map(v, c => {
        const newConfig = {
          ...config,
          parent: new WrapAst({ type: `_${ast.type}$${x}`}, {
            ...config,
            parent: copy,
          })
        };
        const temp = getWrapAst(c, newConfig)
        return config?.traverse ? config.traverse(temp, newConfig) : temp;
      })
    } else if (
      (!isInstanceOf(v, WrapAst))
      // && (!isInstanceOf(v, RuntimeValueAst))
      && _.isObject(v)
      && Reflect.has(v, 'type')) {
      const newConfig = {
        ...config,
        parent: copy
      };
      const temp = getWrapAst(v, newConfig);
      v = config?.traverse ? config.traverse(temp, newConfig) : temp;
    }
    // if (v instanceof RuntimeValueAst) {
    //   console.error('RuntimeValueAst')
    // }
    copy.set(x, v)
  }
  // console.log(copy, '---------')
  return copy;
}

export function transformInnerAst(ast, config) {
  // alert(config);
  // try{
  //   JSON.stringify(ast)
  // }catch(e) {
  //   console.error(e)
  // }
  // console.error(ast, '开始')
  const wrapAst =  getWrapAst(ast, {
    parent: null,
    ...config,
  })
  // console.error(ast, '结束');
  return wrapAst.toAST()
}

RuntimeRefValue.transformInnerAst = transformInnerAst;
RuntimeRefValue.getWrapAst = getWrapAst;
RuntimeRefValue.WrapAst = WrapAst;