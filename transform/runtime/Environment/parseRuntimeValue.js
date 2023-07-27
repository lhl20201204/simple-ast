import { createRuntimeValueAst, isFunctionRuntimeValue, isUndefinedRuntimeValue } from "./utils";
import generateCode from "../Generate";

import { DEBUGGER_DICTS, RUNTIME_LITERAL, RUNTIME_VALUE_TYPE, getRuntimeValueCreateByClassName } from "../constant";
import RuntimeValue, { RuntimeRefValue } from "./RuntimeValue";
import { SPAN_TAG_HTML, isInstanceOf } from "../../commonApi";


const subConfigLevel = (config) => {
  if (!Reflect.has(config, DEBUGGER_DICTS.parseRuntimeValueDeepth)) {
    return config;
  }
  return {
    ...config,
    [ DEBUGGER_DICTS.parseRuntimeValueDeepth]: config [DEBUGGER_DICTS.parseRuntimeValueDeepth] - 1,
  }
}

const runtimeValueToJSFunction = (rv, config) => {
  if (config.weakMap.has(rv)) {
    return config.weakMap.get(rv);
  }
  const ast = rv.getDefinedAst();
  const prototype = rv.getProtoType()
  const bodyCode = `
   // 以下是定义时候的源码字符串
   \`${generateCode(RuntimeRefValue.transformInnerAst(ast.body, {
    [DEBUGGER_DICTS.isHTMLMode]: true,
    noWrapRuntimeValue: true,
    [DEBUGGER_DICTS.prefixSpaceCount]: 4,
  }), { [DEBUGGER_DICTS.isTextMode]: true })
    }\`
  `;
  const args = [..._.map(ast.params, a => generateCode(a, { [DEBUGGER_DICTS.isTextMode]: true }))]
  
  const fnName = rv.getDefinedName() ?? '匿名函数';
  const obj = {
    [fnName]: eval(`(()=> {
      return ${ast.async ? 'async' : ''} function ${
        ast.generator ? '*' : ''
      } ${fnName}(${args.join(',')}) {
        ${bodyCode}
}})()`),
  }
  const ret = obj[fnName];
  config.weakMap.set(rv, ret)
  if (ast.id) {
    const name = generateCode(ast.id, { [DEBUGGER_DICTS.isTextMode]: true });
    Reflect.defineProperty(ret, 'name', {
      value: name
    })
  }
  Reflect.defineProperty(ret, Symbol('_sourceCode'), {
    value: generateCode(ast, { [DEBUGGER_DICTS.isTextMode]: true })
  })
  const newConfig = {
    ...config,
    [DEBUGGER_DICTS.isOutputConsoleFlag]: true,
  };

  // console.log(rv.keys())
  Reflect.deleteProperty(newConfig, DEBUGGER_DICTS.parseRuntimeValueDeepth);

  // config.weakMap.set(rv, ret);
  runtimeValueKeysToJsObject(ret, rv, newConfig)

  Reflect.defineProperty(ret, Symbol('_prototype'), {
    value: parseRuntimeValue(prototype, newConfig)
  })
  // ret.prototype = parseRuntimeValue(prototype)
  return obj[fnName];
}

const runtimeValueToJSClass = (rv, config) => {
  if (config.weakMap.has(rv)) {
    return config.weakMap.get(rv);
  }
  const ast = rv.getDefinedAst();
  const className = rv.getDefinedName() ?? '匿名类'

  const bodyCode = `
   // 以下是定义时候的源码字符串
   \`${generateCode(RuntimeRefValue.transformInnerAst(ast.body, {
    [DEBUGGER_DICTS.isHTMLMode]: true,
    noWrapRuntimeValue: true,
    [DEBUGGER_DICTS.prefixSpaceCount]: 4,
  }), { [DEBUGGER_DICTS.isTextMode]: true })
    }\`
  `;

  // console.log(bodyCode);

  const obj =  {
    [className]: eval(`(()=> {
      return class ${className} {
        [${bodyCode}]
}})()`),
  }
  config.weakMap.set(rv, obj[className]);
  const prototype = rv.getProtoType()
  const proto = rv.getProto();
  const ret = obj[className];

  Reflect.defineProperty(ret, Symbol('_sourceCode'), {
    value: generateCode(ast, { [DEBUGGER_DICTS.isTextMode]: true })
  })
  const newConfig = {
    ...config,
    [DEBUGGER_DICTS.isOutputConsoleFlag]: true,
  };

  // console.log(rv.keys())
  Reflect.deleteProperty(newConfig, DEBUGGER_DICTS.parseRuntimeValueDeepth);

  // config.weakMap.set(rv, ret);
  runtimeValueKeysToJsObject(ret, rv, newConfig)

  Reflect.defineProperty(ret, Symbol('_prototype'), {
    value: parseRuntimeValue(prototype, newConfig)
  })
  Reflect.defineProperty(ret, Symbol('[[__proto__]]'), {
    value: parseRuntimeValue(proto, newConfig)
  })
  return obj[className];
}

const runtimeValueKeysToJsObject = (cloneObj, rv, config) => {
  // if (config.weakMap.has(rv)) {
  //   return;
  // }
  
  for (let key of rv.keys()) {
    // in 循环会遍历原型链的，所以需要判断是否是当前对象的属性
    const desctiptor = rv.getPropertyDescriptor(key);
    if (!desctiptor) {
      console.error(rv);
      throw new Error('没有desctiptor')
    }

    const objDesc = {};
    if (isFunctionRuntimeValue(desctiptor.getAttr('set'))) {
      objDesc.set = parseRuntimeValue(desctiptor.getAttr('set'), (subConfigLevel(config)));
    }

    if (isFunctionRuntimeValue(desctiptor.getAttr('get'))) {
      objDesc.get = parseRuntimeValue(desctiptor.getAttr('get'), (subConfigLevel(config)));
    } else {
      objDesc.value = parseRuntimeValue(desctiptor.getAttr('value'), (subConfigLevel(config)));
    }

    if (config[DEBUGGER_DICTS.isOutputConsoleFlag]) {
      Reflect.defineProperty(cloneObj, key, _.reduce(objDesc, (o, v, k) => {
        return Object.assign(o, { [k]: parseRuntimeValue(v, config) })
      }, {}))
    } else {
      if (objDesc.set) {
        cloneObj['set ' + key] = objDesc.set;
      }

      if (objDesc.get) {
        cloneObj['get ' + key] = objDesc.get;
      } else {
        cloneObj[key] = objDesc.value;
      }
    }
  }
}

export default function parseRuntimeValue(rv, config = {}) {
  if (!isInstanceOf(rv, RuntimeValue) || config[DEBUGGER_DICTS.parseRuntimeValueDeepth] === 0) {
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
    (config[DEBUGGER_DICTS.isOutputConsoleFlag] || config[DEBUGGER_DICTS.isRenderHTMLSourceCode])
     ? RUNTIME_VALUE_TYPE.class 
     : '',
  ].includes(rv.type)) {
    const funast = rv.getDefinedAst();
    if ([
      'FunctionDeclaration',
      'FunctionExpression',
      'ClassDeclaration',
      'ClassExpression',
      'ArrowFunctionExpression'
    ].includes(funast.type)) {
      const ret = generateCode(
        funast,
        {
        [DEBUGGER_DICTS.isTextMode]: config[DEBUGGER_DICTS.isTextMode] ?? true,
        [DEBUGGER_DICTS.isHTMLMode]: !(config[DEBUGGER_DICTS.isTextMode] ?? true),
        [DEBUGGER_DICTS.prefixSpaceCount]: config[DEBUGGER_DICTS.prefixSpaceCount] ?? 0,
        isFunctionEndNotRemark: true,
      });
      const isFunctionType = [
        'FunctionDeclaration',
        'FunctionExpression',
        'ArrowFunctionExpression'
      ].includes(funast.type);
      const finalRet = (config[DEBUGGER_DICTS.isOutputConsoleFlag])
        ? (isFunctionType
          ? runtimeValueToJSFunction(rv, config)
          : runtimeValueToJSClass(rv, config) ?? {
            [DEBUGGER_DICTS.isOutputConsoleFlag]: true,
            title: (funast.id ? generateCode(funast.id, {
              [DEBUGGER_DICTS.isTextMode]: true,
            }) : '匿名') + ' ' + rv.type,
            content: ret
          })
        :  ret;
      return finalRet;
    }
    return `function(){[native code]}`
  }

  if (weakMap.has(rv)) {
    return weakMap.get(rv);
  }

  if (_.isObject(value)) {

     const className = getRuntimeValueCreateByClassName(rv);
     const TEMP = { [className]: eval(`(()=> {
      return class ${className} {
      }})()`)}
     let cloneObj = new TEMP[className]()


    // 存obj
    weakMap.set(rv, cloneObj)

    runtimeValueKeysToJsObject(cloneObj, rv, config);
    
    if (isInstanceOf(rv, RuntimeRefValue)) {
      if (
        rv.type === RUNTIME_VALUE_TYPE.class
        && !isUndefinedRuntimeValue(rv.getMergeCtor())
      ) {
        cloneObj['[[constructor]]'] = parseRuntimeValue(rv.getMergeCtor(), subConfigLevel({
          ...config,
        })) ?? null
      }
  
      cloneObj['[[Prototype]]'] = parseRuntimeValue(rv.getProto(), subConfigLevel(config)) ?? null
      if (!isUndefinedRuntimeValue(rv.getProtoType())) {
        cloneObj['$prototype'] = parseRuntimeValue(rv.getProtoType(), subConfigLevel(config)) ?? null
      }

      if (rv.type === RUNTIME_VALUE_TYPE.class
        && !config[DEBUGGER_DICTS.isOutputConsoleFlag]
        && config[DEBUGGER_DICTS.isHTMLMode]) {
        cloneObj[SPAN_TAG_HTML] = rv;
      }

    }
    return cloneObj
  }
  if (config[DEBUGGER_DICTS.isHTMLMode] && rv.type === RUNTIME_VALUE_TYPE.string) {
    return `"${value}"`
  }
  return value;
}