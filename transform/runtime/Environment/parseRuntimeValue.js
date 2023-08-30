import { createRuntimeValueAst, isFunctionRuntimeValue, isUndefinedRuntimeValue } from "./utils";
import generateCode from "../Generate";

import { DEBUGGER_DICTS, RUNTIME_LITERAL, RUNTIME_VALUE_TYPE, getRuntimeValueCreateByClassName } from "../constant";
import RuntimeValue, { RuntimeRefValue } from "./RuntimeValue";
import { SPAN_TAG_HTML, isInstanceOf } from "../../commonApi";
import { getUndefinedValue } from "./RuntimeValueInstance";
import PropertyDescriptor from "./PropertyDescriptor";


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
  const bodyCode = `
   // 以下是定义时候的源码字符串
   \`${generateCode(RuntimeRefValue.transformInnerAst(ast.body, {
    [DEBUGGER_DICTS.isHTMLMode]: true,
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

  // Reflect.defineProperty(ret, Symbol('_prototype'), {
  //   value: parseRuntimeValue(prototype, newConfig)
  // })
  
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
    [DEBUGGER_DICTS.prefixSpaceCount]: 4,
  }), { [DEBUGGER_DICTS.isTextMode]: true })
    }\`
  `;

  // console.log(bodyCode);

  const obj =  {
    [className]: eval(`(()=> {
      ${ast.superClass ? `
      class ${ast.superClass.name} {

      }
      ` : ''}
      return class ${className} ${ast.superClass ? `extends ${ast.superClass.name}` : ''}{
        [${bodyCode}]
}})()`),
  }
  config.weakMap.set(rv, obj[className]);
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

  // Reflect.defineProperty(ret, Symbol('_prototype'), {
  //   value: parseRuntimeValue(prototype, newConfig)
  // })
  Reflect.defineProperty(ret, Symbol('[[__proto__]]'), {
    value: parseRuntimeValue(proto, newConfig)
  })
  return obj[className];
}

const runtimeValueKeysToJsObject = (cloneObj, rv, config) => {
  // if (config.weakMap.has(rv)) {
  //   return;
  // }

  // const undefinedV = getUndefinedValue()

  for (let key of rv.keys()) {
    // 需要获取自己的属性而不是原型链上给的
    const desctiptor = rv.getOwnPropertyDescriptor(key);
    if (!isInstanceOf(desctiptor, PropertyDescriptor)) {
      console.error(rv);
      throw new Error('没有desctiptor')
    }

    const objDesc = {};
    if (desctiptor.hasAttr('value'))  {
      objDesc.value = parseRuntimeValue(desctiptor.getAttr('value'), (subConfigLevel(config)));
    } else {
      objDesc.set = parseRuntimeValue(desctiptor.getAttr('set'), (subConfigLevel(config)));
      objDesc.get = parseRuntimeValue(desctiptor.getAttr('get'), (subConfigLevel(config)));
    }

    if (config[DEBUGGER_DICTS.isOutputConsoleFlag]) {
      const newDescriptor = _.reduce(objDesc, (o, v, k) => {
        const dv = parseRuntimeValue(v, config);
        return Object.assign(o, { [k]: dv  })
      }, {});
      // if (Reflect.has(objDesc, 'set') || Reflect.has(objDesc, 'get')) {
      //   console.error(cloneObj, key, newDescriptor)
      // }
      Reflect.defineProperty(cloneObj, key, newDescriptor)
    } else {

      if (Reflect.has(objDesc, 'value')) {
        cloneObj[key] = objDesc.value;
      } else {
        cloneObj['set ' + key] = objDesc.set;
        cloneObj['get ' + key] = objDesc.get;
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
          : runtimeValueToJSClass(rv, config))
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
        && !isUndefinedRuntimeValue(rv.getMergeCtorFunctionType())
      ) {
        cloneObj['[[constructor]]'] = parseRuntimeValue(rv.getMergeCtorFunctionType(), subConfigLevel({
          ...config,
        })) ?? null
      }
  
      cloneObj['[[Prototype]]'] = parseRuntimeValue(rv.getProto(), subConfigLevel(config)) ?? null
      // if (!isUndefinedRuntimeValue(rv.getProtoType())) {
      //   cloneObj['$prototype'] = parseRuntimeValue(rv.getProtoType(), subConfigLevel(config)) ?? null
      // }

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