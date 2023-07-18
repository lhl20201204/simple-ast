import Environment from "./runtime/Environment";
import RuntimeValue, { RuntimeRefValue } from "./runtime/Environment/RuntimeValue";
import parseRuntimeValue from "./runtime/Environment/parseRuntimeValue";
import { RUNTIME_VALUE_TYPE } from "./runtime/constant";
let id = 0
let rvId = 0;
const step = 4;

function textReplace(text) {
  try{
    let t = text.replaceAll('\n', '<br/>')
    return t;
  }catch(e) {
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
      const prefixSpace = new Array(prefix - step)
        .fill(0)
        .map(() => config.text ? ' ' : "&nbsp;")
        .join("");

      const prv = parseRuntimeValue(obj, {
        text: false,
        level: 1,
        prefixSpaceCount: prefix - step,
       });

      dom.innerHTML = state ? text : textReplace(
       isNotFunction ? (
        ((['Array', 'arguments'].includes(obj.type) ? "[\n" : '{\n') +
      (writeJSON(
        isNotFunction ? prv : obj,
        prefix, config).join(""))
       + prefixSpace + (['Array', 'arguments'].includes(obj.type) ? "]" : '}'))
       ) : prv
      )
      state = !state;
      dom.setAttribute('title', (!state ? '展开' : '收起') + text)
    })
  }, 0)
  return `<span id="${spanId}" title="展开${text}" style="color: ${isNotFunction ?
    isClass ? '#770088': '#6A9955' : '#B33232'};cursor: pointer;">${text}</span>`
}

const isRefRuntimeValue = (obj) => {
  return obj instanceof RuntimeRefValue
}

const isNotRefRuntimeValue = (obj) => {
  return obj instanceof RuntimeValue
    && !isRefRuntimeValue(obj)
}


export default function writeJSON(obj, prefix, config, weakMap = new WeakMap()) {
  const prefixSpace = new Array(prefix)
    .fill(0)
    .map(() => config.text ? ' ' : "&nbsp;")
    .join("");
  if (weakMap.has(obj)) {
    // return weakMap.get(obj);
    if (config.text) {
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

  if (!config.text) { 
    const hasObj = weakMap.get(obj)
    let ret;
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
      return  ret;
    } else if (obj instanceof RuntimeValue) {
      if (!hasObj) {
        ret = [`<span style="color: #0055AA;">${parseRuntimeValue(obj, {
          isHtml: true,
        })}</span>`]
        weakMap.set(obj, ret);
      } else {
        const objCopy = _.cloneDeep(obj);
        ret = [`<span style="color: #0055AA;">${parseRuntimeValue(objCopy, {
          isHtml: true,
        })}</span>`]
        weakMap.set(objCopy, ret);
      }
      return ret;
    } else if (weakMap.has(obj)) {
      console.error('未处理的循环引用类型', obj);
    }
  }

  const ret = [];
  weakMap.set(obj, ret);
  for (const attr in obj) {
    const t = obj[attr];
    if (t instanceof Object) {
      let next = t;
      const child = writeJSON(next, prefix + step, config, weakMap);
      const isArray = Array.isArray(t);
      const isRefRv = isRefRuntimeValue(t)
      const isNotRefRv = isNotRefRuntimeValue(t)
      const isRv = isRefRv || isNotRefRv;
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
      ret.push(prefixSpace + `${attr * 1 == attr ? "" : attr + ": "}` + (!config.flag ? t : (
        typeof t == 'string' ? `'${t}'` : t
      )) + ",\n");
    }
  }
  // console.log(set)
  return ret;
}