import { EnvJSON, SPAN_TAG_HTML, isInstanceOf } from "./commonApi";
import Environment from "./runtime/Environment";
import RuntimeValue, { RuntimeRefValue } from "./runtime/Environment/RuntimeValue";
import { getWrapAst } from "./runtime/Environment/WrapAst";
import parseRuntimeValue from "./runtime/Environment/parseRuntimeValue";
import { isFunctionRuntimeValue } from "./runtime/Environment/utils";
import { DEBUGGER_DICTS, RUNTIME_VALUE_TYPE } from "./runtime/constant";
let envId = 0;
let rvId = 0;
const step = 4;

function textReplace(text) {
  try {
    let t = text.replaceAll('\n', '<br/>')
    return t;
  } catch (e) {
    console.log(text)
    console.error(e)
  }
}

const createRuntimeValueSpan = ([obj, prefix, config], text, { state }) => {
  const spanId = 'text_span_runtime_value_span ' + rvId++;
  const isNotFunction = ![RUNTIME_VALUE_TYPE.function, RUNTIME_VALUE_TYPE.arrow_func].includes(obj.type)
  const isClass = obj.type === RUNTIME_VALUE_TYPE.class;
  // console.log(obj, spanId)
  setTimeout(() => {
    const dom = document.getElementById(spanId);
    prefix = Math.max(prefix, 0);
    if (!dom) {
      console.error(obj);
      console.error('没有dom元素为' + spanId)
    }
    dom.addEventListener('click', (e) => {
      e.stopPropagation()
      // console.log(dom, '被点击', state)
      const generateSpace = (c) => new Array(c)
        .fill(0)
        .map(() => config[DEBUGGER_DICTS.isTextMode] ? ' ' : "&nbsp;")
        .join("");
      const prefixSpace = generateSpace(prefix - step);

      // const generateText = ;

      // console.log(config, generateText);

      // console.log(dom, '被点击',obj);
      dom.innerHTML = state ? text : textReplace(
        ((isNotFunction
          || !config[DEBUGGER_DICTS.isInWrapFunction])
          &&
          (
            !config[DEBUGGER_DICTS.isInWrapClass]
            || config[DEBUGGER_DICTS.currentAttr] !== SPAN_TAG_HTML
          ))
          ?
          (
            ((['Array', 'arguments'].includes(obj.type) ? "[\n" : '{\n') +
              (writeJSON(
                parseRuntimeValue(
                  isNotFunction ? obj : {
                    prototype: obj.getProtoType(),
                    '[[prototype]]': obj.getProto(),
                    [SPAN_TAG_HTML]: obj,
                  },
                  {
                    [DEBUGGER_DICTS.isHTMLMode]: true,
                    [DEBUGGER_DICTS.isTextMode]: false,
                    [DEBUGGER_DICTS.parseRuntimeValueDeepth]: 1,
                    [DEBUGGER_DICTS.prefixSpaceCount]: prefix - step,
                  }),
                prefix,
                {
                  ...config,
                  [DEBUGGER_DICTS.isHTMLMode]: true,
                  [DEBUGGER_DICTS.isInWrapFunction]: !isNotFunction,
                  [DEBUGGER_DICTS.isInWrapClass]: true,
                }
              ).join(""))
              + prefixSpace + (['Array', 'arguments'].includes(obj.type) ? "]" : '}'))
          )
          :
          parseRuntimeValue(obj, {
            [DEBUGGER_DICTS.isRenderHTMLSourceCode]: isNotFunction && config[DEBUGGER_DICTS.currentAttr] === SPAN_TAG_HTML,
            [DEBUGGER_DICTS.isTextMode]: false,
            [DEBUGGER_DICTS.parseRuntimeValueDeepth]: 1,
            [DEBUGGER_DICTS.prefixSpaceCount]: prefix - step,
          })
      )
      state = !state;

      let titleAttribute = ('收起' + text);

      if (!state) {
        if (isNotFunction && !isClass) {
          titleAttribute = ('展开' + text)
        } else {
          titleAttribute = parseRuntimeValue(obj, {
            // [DEBUGGER_DICTS.isRenderingHTMLFlag]: true,
            [DEBUGGER_DICTS.isTextMode]: true,
            [DEBUGGER_DICTS.parseRuntimeValueDeepth]: 1,
            [DEBUGGER_DICTS.prefixSpaceCount]: 0,
          })
        }
      }


      dom.setAttribute('title', titleAttribute)
    })
  }, 0)

  let initTitle = ('展开' + text);
  if ((!isNotFunction) || isClass) {
    initTitle = (parseRuntimeValue(obj, {
      // [DEBUGGER_DICTS.isRenderingHTMLFlag]: true,
      [DEBUGGER_DICTS.isRenderHTMLSourceCode]: true,
      [DEBUGGER_DICTS.isTextMode]: true,
      [DEBUGGER_DICTS.parseRuntimeValueDeepth]: 1,
      [DEBUGGER_DICTS.prefixSpaceCount]: 0,
    }).replaceAll('\n', '&#10;'));
  }

  // console.log(initTitle)
  return `<span id="${spanId}" title="${initTitle}" style="color: ${isNotFunction ?
    isClass ? '#770088' : '#6A9955' : '#B33232'};cursor: pointer;">${text}</span>`
}


const createEnvJSONSpan = ([obj, prefix, config], text, { state }) => {
  const spanId = 'text_span_Env_JSON_span ' + envId++;
  // console.log(obj, spanId)
  setTimeout(() => {
    const dom = document.getElementById(spanId);
    prefix = Math.max(prefix, 0);
    if (!dom) {
      console.error(obj);
      console.error('没有dom元素为' + spanId)
    }
    dom.addEventListener('click', (e) => {
      e.stopPropagation()
      // console.log(dom, '被点击', state)
      const prefixSpace = new Array(prefix)
        .fill(0)
        .map(() => config[DEBUGGER_DICTS.isTextMode] ? ' ' : "&nbsp;")
        .join("");

      dom.innerHTML = state ? text : textReplace(
        '{\n' +
        writeJSON(obj, prefix + step, { ...config, [DEBUGGER_DICTS.onlyShowEnvName]: false }).join("")
        + prefixSpace + '}'
      )
      state = !state;
      dom.setAttribute('title', (!state ? '展开' : '收起') + text)
    })
  }, 0)
  return `<span id="${spanId}" title="展开${text}" style="color: ${'black'};cursor: pointer;">${text}</span>`
}

const isRefRuntimeValue = (obj) => {
  return isInstanceOf(obj, RuntimeRefValue)
}

const isNotRefRuntimeValue = (obj) => {
  return isInstanceOf(obj, RuntimeValue)
    && !isRefRuntimeValue(obj)
}


export default function writeJSON(obj, prefix, config, weakMap = new WeakMap()) {
  const prefixSpace = new Array(prefix)
    .fill(0)
    .map(() => config[DEBUGGER_DICTS.isTextMode] ? ' ' : "&nbsp;")
    .join("");
  if (weakMap.has(obj)) {
    // return weakMap.get(obj);
    if (config[DEBUGGER_DICTS.isTextMode]) {
      return weakMap.get(obj);
    }
    // console.log('loop')
    // const newObj = _.cloneDeep(obj);
    // const ret = [createSpan([newObj, prefix, config],
    //   prefixSpace + 'Circular reference<br/>',
    //   { state: false })]
    // weakMap.set(newObj, ret)
    // console.log('enter Circular reference');
    // return ret;
  }

  if (config[DEBUGGER_DICTS.isHTMLMode]) {
    const hasObj = weakMap.get(obj)
    let ret;
    if (isInstanceOf(obj, EnvJSON) && config[DEBUGGER_DICTS.onlyShowEnvName]) {
      if (!hasObj) {
        ret = [createEnvJSONSpan([obj, prefix, config], obj._envName, { state: false })]
        weakMap.set(obj, ret);
      }
      return ret;
    }
    if (isRefRuntimeValue(obj)) {
      if (!hasObj) {
        ret = [createRuntimeValueSpan([obj, prefix, config], obj.type, { state: false })]
        weakMap.set(obj, ret);
      } else {
        const objCopy = _.cloneDeep(obj);
        //  console.log('enter', objCopy instanceof RuntimeValue);
        ret = [createRuntimeValueSpan([objCopy, prefix, config], objCopy.type, { state: false })]
        weakMap.set(objCopy, ret);
      }
      return ret;
    } else if (isInstanceOf(obj, RuntimeValue)) {
      if (!hasObj) {
        ret = [`<span style="color: #0055AA;">${parseRuntimeValue(obj, {
          [DEBUGGER_DICTS.isHTMLMode]: true,
        })}</span>`]
        weakMap.set(obj, ret);
      } else {
        const objCopy = _.cloneDeep(obj);
        ret = [`<span style="color: #0055AA;">${parseRuntimeValue(objCopy, {
          [DEBUGGER_DICTS.isHTMLMode]: true,
        })}</span>`]
        weakMap.set(objCopy, ret);
      }
      // console.error(ret)
      return ret;
    } else if (weakMap.has(obj)) {
      console.error('未处理的循环引用类型', obj);
      // if (isInstanceOf(obj, RuntimeValue)) {
      //   return parseRuntimeValue(obj)
      // }
      return weakMap.get(obj)
    }
  }

  const ret = [];
  weakMap.set(obj, ret);
  // if (obj instanceof Environment) {
  //   console.error('$hideInHTML')
  // }
  for (let attr in obj) {
    const t = obj[attr];

    if (isInstanceOf(t, Object)) {
      let next = t;

      const child = writeJSON(next, prefix + step, {
        ...config,
        [DEBUGGER_DICTS.onlyShowEnvName]: true,
        [DEBUGGER_DICTS.currentAttr]: attr
      }, weakMap);
      const isArray = Array.isArray(t);
      const isRefRv = isRefRuntimeValue(t)
      const isNotRefRv = isNotRefRuntimeValue(t)
      const isRv = isRefRv || isNotRefRv || isInstanceOf(t, EnvJSON);
      if ((attr?.startsWith('set ') || attr?.startsWith('get ')) && isFunctionRuntimeValue(t)) {
        attr = `<span title="这是${attr.slice(4)}的${attr.slice(0, 3)}ter函数" style="cursor:pointer;color: red;">${attr}</span>`
      }
      ret.push(
        prefixSpace +
        `${(isArray && attr * 1 == attr) ? "" : attr + ": "}` +
        `${isArray ? "[\n" :
          (isRv) ? '' : "{\n"}`
      );
      ret.push(child.join(""));
      ret.push((isRv) ? ',\n' : (prefixSpace + `${isArray ? "],\n" :
        "},\n"}`));
    } else {
      ret.push(prefixSpace + `${attr * 1 == attr ? "" : attr + ": "}` + (!config[DEBUGGER_DICTS.isStringTypeUseQuotationMarks] ? t : (
        typeof t == 'string' ? `'${t}'` : t
      )) + ",\n");
    }
  }
  // console.log(set)
  return ret;
}