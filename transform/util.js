import { AstJSON, EnvJSON, SPAN_TAG_HTML, isInstanceOf, isJsSymbolType, stringFormat } from "./commonApi";
import Environment from "./runtime/Environment";
import PropertyDescriptor from "./runtime/Environment/PropertyDescriptor";
import RuntimeValue, { RuntimeRefValue } from "./runtime/Environment/RuntimeValue";
import { getWrapAst } from "./runtime/Environment/WrapAst";
import parseRuntimeValue from "./runtime/Environment/parseRuntimeValue";
import { createPropertyDesctiptor, createSimplePropertyDescriptor, isFunctionRuntimeValue } from "./runtime/Environment/utils";
import { RegExpToken } from "./runtime/RegExp/Token";
import ASTItem from "./runtime/ast/ASTITem";
import { DEBUGGER_DICTS, JS_TO_RUNTIME_VALUE_TYPE, PROPERTY_DESCRIPTOR_DICTS, RUNTIME_VALUE_DICTS, RUNTIME_VALUE_TYPE } from "./runtime/constant";
let envId = 0;
let rvId = 0;
let astId = 0;
let debuggerEnvId = 0;
let debuggerRvId = 0;
let debuggerAstId = 0;
const step = 4;

const colorMap = new Map()
colorMap.set('ExpressionStatement', '#B33232');
colorMap.set('VariableDeclaration', '#6A9955');
colorMap.set('FunctionDeclaration', '#0055AA');
colorMap.set('ClassDeclaration', '#770088');
colorMap.set('LabeledStatement', 'black');
function randomColor(c) {
  if (colorMap.has(c)) {
    return colorMap.get(c)
  }
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  colorMap.set(c, color);
  return color;
}

export function relaceTextToHtml(str) {
  try {
    const ret = [];
    _.forEach(str, (x, i) => {
      if (x === '\n') {
        ret.push(`<br data-index="${i}" />`);
      } else {
        ret.push(x);
      }
    });
    return ret.join('');
  } catch (e) {
    console.log(text)
    console.error(e)
  }
}

const createRuntimeValueSpan = ([obj, prefix, config], text, { state }) => {
  const isDebuggering = config[DEBUGGER_DICTS.isDebuggering];
  const spanId = (isDebuggering ? 'debugger_text_span_runtime_value_span' + debuggerRvId++ : 'text_span_runtime_value_span ' + rvId++);
  const isNotFunction = ![RUNTIME_VALUE_TYPE.function, RUNTIME_VALUE_TYPE.arrow_func].includes(obj.type)
  const isClass = obj.type === RUNTIME_VALUE_TYPE.class;
  // console.log(obj, spanId)
  setTimeout(() => {
    const dom = document.getElementById(spanId);
    prefix = Math.max(prefix, 0);
    if (!dom) {
      console.error(obj);
      console.error('没有dom元素为' + spanId)
      return;
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
      dom.innerHTML = state ? text : relaceTextToHtml(
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
                  isNotFunction ? obj : new RuntimeRefValue(RUNTIME_VALUE_TYPE.object, {
                    ..._.reduce(obj.keys(), (obj2, k) => {
                      // likaiyijui
                      return Object.assign(obj2, {
                        [k]: obj.get(k),
                      })
                    }, {}),
                    [SPAN_TAG_HTML]: obj,
                  }, {
                    [RUNTIME_VALUE_DICTS.proto]: obj.getProto(),
                    [RUNTIME_VALUE_DICTS.$propertyDescriptors]: (
                      () => {
                        const old = _.cloneDeep(obj.propertyDescriptors);
                        old.set(SPAN_TAG_HTML, createSimplePropertyDescriptor({
                          value: obj
                        }))
                        // console.log(old);
                        return old;
                      }
                    )()
                  }) ?? {
                    // prototype: obj.getProtoType(),
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

const astJsonContainer = document.getElementById('astJsonContainer')
const sourceDom = document.getElementById('source');
const findNearDom = (dom) => {
  let p = dom.parentNode;
  const findDom = p => _.startsWith(p.id, 'debugger_text_span_AST_JSON_span') ||
  _.startsWith(p.id, 'text_span_AST_JSON_span')
  while (p !== astJsonContainer && !(
    findDom(p)
  )) {
    p = dom.parentNode;
  }
  if (findDom(p)) {
    return p;
  }
  return null;
}

let lastSelected = null;

const unselectedDom = (dom) => {
  dom.classList.remove('selectedBottomColor')
}

export function convertHtmlToText(inputText) {
  let returnText = "" + inputText;

  returnText = returnText.replace(/<\/div>/ig, '\r\n');
  returnText = returnText.replace(/<\/li>/ig, '\r\n');
  returnText = returnText.replace(/<li>/ig, '  *  ');
  returnText = returnText.replace(/<\/ul>/ig, '\r\n');
  returnText = returnText.replace(/&nbsp;/ig, ' ');
  //-- 删除br标签并用换行符替换它们
  returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

  //-- 删除P和A标签，但保留其中的内容
  returnText = returnText.replace(/<p.*?>/gi, "\r\n");
  returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

  //-- 截取图片标签中的路径内容
  if (returnText.indexOf("<img") > -1) {
    //去空格
    // returnText = returnText.replace(/\s+/g, '');
    returnText = returnText + returnText.substring(returnText.indexOf("src=\"") + 5, returnText.indexOf("g\"") + 1);
  }
  //-- 删除所有SCRIPT和STYLE标签
  returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
  returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
  //-- 删除所有其他
  returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

  //--摆脱2个以上的多个换行符：
  returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

  //-- 摆脱2个以上的空格：
  returnText = returnText.replace(/ +(?= )/g, '');

  //-- 摆脱html编码的字符：
  returnText = returnText.replace(/ /gi, " ");
  returnText = returnText.replace(/&/gi, "&");
  returnText = returnText.replace(/"/gi, '"');
  returnText = returnText.replace(/</gi, '<');
  returnText = returnText.replace(/>/gi, '>');

  // 空数据判断
  if (isBlank(returnText))
    returnText = "";

  return returnText;
}

export const getRowColBySourceCodeIndex = (index) => {
  
  const arr = [...window.mapObj.tokenIndexToDomMap];
  const item =  _.findLast(arr, x => x[1][0] <= index);
  let s = item[1][0]
  let offset = s;

  while(offset < index) {
    offset++;
  }
  const len = offset - s
  // console.log(item, index);
  return [item[0],len]
}

export function selectStartEnd(start, end) {
  var selection = window.getSelection();
  var range = document.createRange();
  const [si, sofset] = getRowColBySourceCodeIndex(start)
  const [ei, eofset] = getRowColBySourceCodeIndex(end)
  const startDom = sourceDom.childNodes[si];
  let f = startDom;
  let ti =si;
  while(f && !f.scrollIntoView) {
    f =  sourceDom.childNodes[ti++];
  }
  if (f?.scrollIntoView) {
    f.scrollIntoView({
      behavior:'smooth',
      block: 'center',
      inline:  'end'
    })
  }
  range.setStart(startDom, sofset);
  const endDom = sourceDom.childNodes[ei];
  range.setEnd(endDom,  isInstanceOf(endDom, HTMLBRElement) ? 0 : eofset + 1 );
  selection.removeAllRanges();
  selection.addRange(range);
}

export const selectedDom = (dom) => {
  if (lastSelected) {
    unselectedDom(lastSelected)
  }
  const astJson = window.mapObj.domAstWeakMap.get(dom);
  if (!astJson) {
    console.warn('无法找到对应json')
    return
  }
  const { start, end } = astJson;
  selectStartEnd(start, end);
  lastSelected = dom;
  lastSelected.classList.add('selectedBottomColor');
}

const createASTJSONSpan = ([obj, prefix, config], text, { state }) => {
  const isDebuggering = config[DEBUGGER_DICTS.isDebuggering];
  const spanId = (isDebuggering ? 'debugger_text_span_AST_JSON_span ' + debuggerAstId++ : 'text_span_AST_JSON_span ' + astId++);
  // console.log(obj, spanId)
  setTimeout(() => {
    const dom = document.getElementById(spanId);
    if (!dom) {
      console.warn('没有挂载')
      return
    }
    dom.dataset.state = state;
    window.mapObj.domAstWeakMap.set(dom, obj)
    window.mapObj.astDomWeakMap.set(obj, dom)
    prefix = Math.max(prefix, 0);
    if (!dom) {
      console.error(obj);
      console.error('没有dom元素为' + spanId)
      return;
    }
    dom.addEventListener('click', (e) => {
      e.stopPropagation()
      // console.log(dom, '被点击', state)
      let prefixSpace = new Array(prefix)
        .fill(0)
        .map(() => config[DEBUGGER_DICTS.isTextMode] ? ' ' : "&nbsp;")
        .join("");
      if (!config[DEBUGGER_DICTS.isTextMode]) {
        prefixSpace = "<span class=\"space\">" + prefixSpace + "</span>"
      }

      dom.innerHTML = state ? text : relaceTextToHtml(
        '{\n' +
        writeJSON(obj, prefix + step, { ...config, [DEBUGGER_DICTS.onlyShowAstItemName]: false }).join("")
        + prefixSpace + '}'
      )
      state = !state;
      dom.setAttribute('title', (!state ? '展开' : '收起') + text)
      dom.dataset.state = state;
      if (state) {
        selectedDom(dom)
      } else {
        unselectedDom(dom);
        const pDom = (findNearDom(dom))
        if (pDom) {
          selectedDom(pDom)
        }
      }
    })
  }, 0)
  return `<span id="${spanId}" title="展开${text}" style="color: ${randomColor(text)};cursor: pointer;">${text}</span>`
}


const createEnvJSONSpan = ([obj, prefix, config], text, { state }) => {
  const isDebuggering = config[DEBUGGER_DICTS.isDebuggering];
  const spanId = (isDebuggering ? 'debugger_text_span_Env_JSON_span ' + debuggerEnvId++ : 'text_span_Env_JSON_span ' + envId++);
  // console.log(obj, spanId)
  setTimeout(() => {
    const dom = document.getElementById(spanId);
    prefix = Math.max(prefix, 0);
    if (!dom) {
      console.error(obj);
      console.error('没有dom元素为' + spanId)
      return;
    }
    dom.addEventListener('click', (e) => {
      e.stopPropagation()
      // console.log(dom, '被点击', state)
      const prefixSpace = new Array(prefix)
        .fill(0)
        .map(() => config[DEBUGGER_DICTS.isTextMode] ? ' ' : "&nbsp;")
        .join("");

      dom.innerHTML = state ? text : relaceTextToHtml(
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
  let prefixSpace = new Array(prefix)
    .fill(0)
    .map(() => config[DEBUGGER_DICTS.isTextMode] ? ' ' : "&nbsp;")
    .join("");

  if (!config[DEBUGGER_DICTS.isTextMode]) {
    prefixSpace = "<span class=\"space\">" + prefixSpace + "</span>"
  }

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
      } else {
        console.log('进来')
        const objCopy = _.cloneDeep(obj);
        ret = [createEnvJSONSpan([objCopy, prefix, config], objCopy._envName, { state: false })]
        weakMap.set(objCopy, ret);
      }
      return ret;
    }

    if (isInstanceOf(obj, AstJSON) && config[DEBUGGER_DICTS.onlyShowAstItemName]) {
      if (!hasObj) {
        ret = [createASTJSONSpan([obj, prefix, config], obj.type, { state: false })]
        weakMap.set(obj, ret);
      } else {
        const objCopy = _.cloneDeep(obj);
        ret = [createASTJSONSpan([objCopy, prefix, config], objCopy.type, { state: false })]
        weakMap.set(objCopy, ret);
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
        ret = [`<span style="color: #0055AA;">${stringFormat(parseRuntimeValue(obj, {
          [DEBUGGER_DICTS.isHTMLMode]: true,
        }))}</span>`]
        weakMap.set(obj, ret);
      } else {
        const objCopy = _.cloneDeep(obj);
        ret = [`<span style="color: #0055AA;">${stringFormat(parseRuntimeValue(objCopy, {
          [DEBUGGER_DICTS.isHTMLMode]: true,
        }))}</span>`]
        weakMap.set(objCopy, ret);
      }
      // console.error(ret)
      return ret;
    } else if (weakMap.has(obj)) {
      if (!isInstanceOf(obj, RegExpToken)) {
        console.error('未处理的循环引用类型', obj, config);
      }
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
    attr = stringFormat(attr)

    if (isInstanceOf(t, Object)) {
      let next = t;

      const child = writeJSON(next, prefix + step, {
        ...config,
        [DEBUGGER_DICTS.onlyShowEnvName]: true,
        [DEBUGGER_DICTS.onlyShowAstItemName]: true,
        [DEBUGGER_DICTS.currentAttr]: attr
      }, weakMap);
      const isArray = Array.isArray(t);
      const isRefRv = isRefRuntimeValue(t)
      const isNotRefRv = isNotRefRuntimeValue(t)
      const isRv = isRefRv || isNotRefRv || isInstanceOf(t, EnvJSON) || isInstanceOf(t, AstJSON);
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
      let text = prefixSpace + `${attr * 1 == attr ? "" : attr + ": "}` + (!config[DEBUGGER_DICTS.isStringTypeUseQuotationMarks] ? t : (
        typeof t == 'string' ? `'${t}'` : t
      )) + ",\n";
      ret.push(text);
    }
  }
  // console.log(set)
  return ret;
}