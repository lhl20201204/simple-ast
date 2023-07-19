import { isUndefinedRuntimeValue } from "./utils";
import generateCode from "../Generate";
import { DEBUGGER_DICTS, RUNTIME_VALUE_TYPE } from "../constant";
import RuntimeValue, { RuntimeRefValue } from "./RuntimeValue";

const subConfigLevel = (config) => {
  if (!Reflect.has(config, 'level')) {
    return config;
  }
  return {
    ...config,
    level: config.level - 1,
  }
}
export default function parseRuntimeValue(rv, config = {}) {
  if (!(rv instanceof RuntimeValue) || config.level === 0) {
    return rv;
  }
  if (!Reflect.has(config, 'weakMap')) {
    config.weakMap = new WeakMap();
  }
  const { weakMap } = config;
  const value = rv.value
  if (Array.isArray(value)) {
    const ret = []
    weakMap.set(rv, ret)
    _.forEach(value, item => ret.push(
      parseRuntimeValue(item, subConfigLevel(config))
    ))
    return ret
  }

  if ([
    RUNTIME_VALUE_TYPE.function,
   RUNTIME_VALUE_TYPE.arrow_func,
    config.isOutputConsole ? RUNTIME_VALUE_TYPE.class : '',
  ].includes(rv.type)) {
    const funast = rv.getDefinedAst();
    if ([
      'FunctionDeclaration',
      'FunctionExpression',
      'ClassDeclaration',
      'ClassExpression',
      'ArrowFunctionExpression'
    ].includes(funast.type)) {
      const ret =  generateCode(funast, {
        text: config.text ?? true,
        isFunctionEndNotRemark: true,
        prefixSpaceCount: config.prefixSpaceCount ?? 0
      });
      return (config.isOutputConsole ) ? {
        [DEBUGGER_DICTS.isOutputConsoleFlag]: true,
        title: (funast.id ? generateCode(funast.id, {
          text: true,
        }) : '匿名') + ' ' + rv.type ,
        content: ret
      } : ret;
    }
    return `function(){[native code]}`
  }

  if (weakMap.has(rv)) {
    return weakMap.get(rv);
  }

  if (_.isObject(value)) {
    let cloneObj = new value.__proto__.constructor()

    // 存obj
    weakMap.set(rv, cloneObj)

    for (let key in value) {
      // in 循环会遍历原型链的，所以需要判断是否是当前对象的属性
      if (value.hasOwnProperty(key)) {
        cloneObj[`${key}`] = parseRuntimeValue(value[key], subConfigLevel(config))
      }
    }
    if (rv instanceof RuntimeRefValue) {
      if (rv.type === RUNTIME_VALUE_TYPE.class && !isUndefinedRuntimeValue(rv.getMergeCtor())) {
        cloneObj['[[constructor]]'] = parseRuntimeValue(rv.getMergeCtor(), subConfigLevel({
          ...config,
        })) ?? null
      }
      cloneObj['[[Prototype]]'] = parseRuntimeValue(rv.getProto(), subConfigLevel(config)) ?? null
       if (!isUndefinedRuntimeValue(rv.getProtoType())) {
        cloneObj['prototype'] = parseRuntimeValue(rv.getProtoType(), subConfigLevel(config)) ?? null
       }
    }
    return cloneObj
  }
  if (config.isHtml && rv.type === RUNTIME_VALUE_TYPE.string) {
    return `"${value}"`
  }
  return value;
}