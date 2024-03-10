import { textList } from "./test";
import transform from "./transform";
import { AST } from "./transform/getAst";
import Ast from './transform/runtime/ast/index';
import parseAst, { setLoop } from "./transform/runtime";
import Environment from "./transform/runtime/Environment";
import { getWindowEnv } from "./transform/runtime/Environment/getWindow";
import generateCode from "./transform/runtime/Generate";
import writeJSON, { getRowColBySourceCodeIndex, relaceTextToHtml, selectStartEnd } from "./transform/util";
import { DEBUGGER_DICTS } from "./transform/runtime/constant";
import { createPromiseRvAndPromiseResolveCallback } from "./transform/runtime/Environment/utils";
import { AstJSON, copyToClipboard, debounceCopyToClipboard, diffStr, isInstanceOf } from "./transform/commonApi";
import ASTItem from "./transform/runtime/ast/ASTITem";
import { getYieldValue, isYieldError } from "./transform/runtime/Parse/parseYieldExpression";
import { RuntimeAwaitValue } from "./transform/runtime/Environment/RuntimeValue";
import parseRuntimeValue from "./transform/runtime/Environment/parseRuntimeValue";
import { innerParseProgram } from "./transform/runtime/Parse/parseProgram";
import { CookedToRaw, rawToCooked } from "./transform/runtime/ast/utils";

const source = document.getElementById('source');
const astJsonContainer = document.getElementById('astJsonContainer');
const envJsonContainer = document.getElementById('envJsonContainer');

source.addEventListener('scroll', _.throttle((x) => {
  const dom = document.getElementById('currentDebuggerSpan');
  if (dom) {
    const { left, top, width } = dom.getBoundingClientRect()
    debuggerScene.style.left = `${left + width}px`;
    debuggerScene.style.top = `${top}px`;
  }
  source_copy.style.top = `-${source.scrollTop}px`;
}, 50, {
  leading: false,
  trailing: true
}))

window.tokenIndexToDomMap = new Map();

debuggerBtn.onclick = () => {
  // console.log('点击');
  const debuggerScene = document.getElementById('debuggerScene');
  // if (debuggerScene.parentNode) {
  //   debuggerScene.parentNode.removeChild(debuggerScene)
  //   document.body.appendChild(debuggerScene);
  // }

  debuggerScene.style.opacity = 0;
}

const writeAstAndRun = (ast, noRun) => {
  // console.clear();
  // console.warn(new Error().stack);
  astJsonContainer.innerHTML = relaceTextToHtml("{\n" + writeJSON(ast, 2, {
    [DEBUGGER_DICTS.isStringTypeUseQuotationMarks]: false,
    [DEBUGGER_DICTS.isHTMLMode]: true,
    [DEBUGGER_DICTS.onlyShowAstItemName]: false
  }).join("") + "}");

  const win = getWindowEnv();

  const runCode = (index = 0) => {
    try {
      innerParseProgram(ast, index > 0);
    } catch (e) {
      if (isYieldError(e)) {
        const rv = getYieldValue(e);
        if (isInstanceOf(rv, RuntimeAwaitValue)) {
          setTimeout(() => runCode(index + 1), parseRuntimeValue(rv))
        } else {
          runCode(index + 1)
        }
      } else {
        console.error(e)
      }
    }
  }
  if (!noRun) {
    runCode();
    envJsonContainer.innerHTML = '正在写入环境中，请稍等';
    requestIdleCallback(() => {
      console.time('写环境上下文操作花费时间')
      envJsonContainer.innerHTML = relaceTextToHtml("{\n" + writeJSON(win.toWrite(), 2, {
        [DEBUGGER_DICTS.isStringTypeUseQuotationMarks]: true,
        [DEBUGGER_DICTS.isHTMLMode]: true,
        [DEBUGGER_DICTS.onlyShowEnvName]: false
      }).join("") + "}");
      console.timeEnd('写环境上下文操作花费时间')
    })
  }
}

const astInstance = new Ast()

function omitAttrsDfs(x, attrs) {
  if (isInstanceOf(x, ASTItem)) {
    const obj = {}
    for (const t in x) {
      if (attrs.includes(t)) {
        continue;
      }
      obj[t] = omitAttrsDfs(x[t], attrs)
    }
    return new AstJSON(obj);
  }
  if (Array.isArray(x)) {
    return _.map(x, c => (omitAttrsDfs(c, attrs)))
  }
  return x;
}

function onlyPickIndentifyDfs(x) {
  if (isInstanceOf(x, ASTItem)) {
    const obj = { type: x.type }
    if (x.type === 'Identifier') {
      obj.name = x.name
    }
    for (const t in x) {
      if (t === 'tokens') {
        continue;
      }
      if (isInstanceOf(x[t], ASTItem)
        || Array.isArray(x[t])) {

        obj[t] = onlyPickIndentifyDfs(x[t])
      }
    }
    return obj;
  }
  if (Array.isArray(x)) {
    return _.map(x, onlyPickIndentifyDfs)
  }
}


function getErrorInfoPrefixContent(index) {
  const [sRow, sCol] = getRowColBySourceCodeIndex(index);
  const totalArr = [...window.tokenIndexToDomMap];
  const arr = _.slice(totalArr, 0, sRow);
  const ret = []
  for (const [, [, nodesStr]] of arr) {
    if (nodesStr !== '\n') {
      ret.push(nodesStr);
    } else {
      ret.push('<br/>');
    }
  }
  const currentLineItem = totalArr[sRow]
  const [, lineStr] = currentLineItem[1];
  console.error({ currentLineItem, totalArr, index, str: currentLineItem[1] });
  return [ret.join('') ,sCol, lineStr]
}

let currentSourceCodeStr = ""
let currentAstWithoutStartEnd = {}

const debounceThrowError = _.debounce((err) => {
  requestIdleCallback(() => {
    const e = _.get(err, 'errorInfo', {});
    if (Array.isArray(e.charList)) {
      const { start, end } = e.errorToken;
      Reflect.defineProperty(e, '点击跳转到错误的token', {
        get() {
          selectStartEnd(start, end)
        }
      })
      console.log(e)
      const [prefixLine, sCol, lineStr] = getErrorInfoPrefixContent(start);
      const html = `<div>${ prefixLine + lineStr.slice(0, sCol) + `<span style="border-bottom: 3px solid red;">${e.errorToken.value
        }</span>` +  lineStr.slice(sCol + _.size(e.errorToken.value))
        }</div>`


      source_copy.innerHTML = html;
    }
    console.error(err);
  })
}, 500);

const writeSourceCodeAndRun = (text, shouldNoRun) => {
  astInstance.markSourceCode(text);
  try {
    source_copy.innerHTML = '';
    const ast = astInstance.getAst();
    let nextAstWithoutStartEnd = omitAttrsDfs(ast, ['tokens', 'start', 'end']);
    const noRun = shouldNoRun || _.isEqual(
      currentAstWithoutStartEnd,
      nextAstWithoutStartEnd
    );
    if (!noRun) {
      currentAstWithoutStartEnd = nextAstWithoutStartEnd;
    }
    const generateText = _.map(ast.tokens, 'value').join('')
    if (text !== generateText) {
      console.warn(astInstance.astContext, ast, text.length, generateText.length, [text, generateText], diffStr(text, generateText))
      throw new Error('token 漏了');
    }
    if (!noRun || currentSourceCodeStr !== text) {
      const simpleAst = _.T(ast, true)
      console.log([ast, onlyPickIndentifyDfs(ast), simpleAst])
      writeAstAndRun(omitAttrsDfs(ast, ['tokens']), noRun);
    }
    currentSourceCodeStr = text;
  } catch (err) {
    currentSourceCodeStr = text;
    debounceSaveTokensLineMessage('errorToken')
    debounceThrowError(err);
  }
}

function saveTokensLineMessage(type) {
  (() => {
    // let childNodes = [...source.childNodes];

    let childNodeIndex = 0;
    const map = window.tokenIndexToDomMap;
    map.clear();
    // console.warn('保存', currentSourceCodeStr === source.innerText, [currentSourceCodeStr.length, currentSourceCodeStr.split('')])
    let totalIndex = 0;
    // childNodes.forEach(x => {
    //   if (x instanceof HTMLBRElement) {
    //     return map.set(childNodeIndex++, [totalIndex++, '\n']);
    //   }
    //   if ( x instanceof Text) {
    //     let t = x.textContent;
    //     map.set(childNodeIndex++, [totalIndex, t]);
    //     totalIndex+= _.size(t);
    //     return 
    //   }
    //   const dom = x;
    //   let t =  x.innerText
    //   map.set(childNodeIndex++, [totalIndex, t]);
    //   totalIndex += _.size(t)
    //   if (dom instanceof HTMLDivElement) {
    //     const textDom = document.createTextNode(x.innerText);
    //     const brDom = document.createElement('br');
    //     source.insertBefore(brDom, dom);
    //     source.insertBefore(textDom, brDom);
    //     x.remove()
    //     map.set(childNodeIndex++, [totalIndex++, '\n']);
    //   }
    //   return ;
    // })
    let len = currentSourceCodeStr.length;
  
    map.set(childNodeIndex, [0, '']);
    for (let i = 0; i < len; i++) {
      const c = currentSourceCodeStr[i];
      let tempString = map.get(childNodeIndex)[1];
      if (c === '\n') {
        map.set(_.size(tempString) === 0 ? childNodeIndex : ++childNodeIndex, [i, c]);
        map.set(++childNodeIndex, [i + 1, ''])
      } else {
        map.get(childNodeIndex)[1] = tempString + c;
      }
    }
    // console.warn('保存',type);
    const newStr = _.map([...map], '1.1').join('');
    // console.log(map)
    if ( newStr !== currentSourceCodeStr) {
      console.warn([newStr.length, currentSourceCodeStr.length,newStr.split(''), currentSourceCodeStr.split('')]);
      throw '保存出错'
    }
  })()
}

const debounceSaveTokensLineMessage = _.debounce(saveTokensLineMessage,
  200, {
  leading: true,
  trailing: false,
})

let shouldHandleWrapLine = false;

let isFocusingAndChange = false;

source.addEventListener('keypress', function (e) {
  if (e.code === 'Enter') {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection) {
      const t = selection.getRangeAt(0);
      const tContainer = t.endContainer;
      if (
        tContainer instanceof Text &&
        t.endOffset === _.size(tContainer) &&
        (!tContainer.nextSibling ||
          tContainer.nextSibling instanceof HTMLBRElement)
      ) {
        // console.warn('文字末尾换行');
        document.execCommand('insertHTML', false, '<br/><br/>');
        const r = new Range();
        selection.removeAllRanges();
        const nextContainer = tContainer.nextSibling.nextSibling;
        r.setStart(nextContainer, 0);
        r.setEnd(nextContainer, 0);
        selection.addRange(r);
      } else if (
        tContainer === source ||
        tContainer instanceof HTMLBRElement
      ) {
        let nextContainer =
          tContainer instanceof HTMLBRElement
            ? tContainer.nextSibling
            : tContainer.childNodes[t.endOffset]?.nextSibling;
        document.execCommand('insertHTML', false, '<br/><br/>');
        nextContainer =
          nextContainer?.previousSibling ||
          _.last(source.childNodes);
        // console.warn(
        //   '空白换行',
        //   nextContainer === tContainer,
        //   nextContainer,
        // );
        const r = new Range();
        selection.removeAllRanges();
        r.setStart(nextContainer, 0);
        r.setEnd(nextContainer, 0);
        selection.addRange(r);
      } else {
        // console.warn('文字中间换行', tContainer);
        document.execCommand('insertHTML', false, '<br/>');
      }
    }
  }
})

source.addEventListener(
  'input',
  _.debounce((e) => {
    isFocusingAndChange = true;
    let str = ensureDomOnlyTextAndBr()
    writeSourceCodeAndRun(str, true)
    debounceSaveTokensLineMessage('oninput.debounce')
    shouldHandleWrapLine = true;
  }, 200)
)

source.addEventListener('click', () => {
  const range = window.getSelection()?.getRangeAt(0);
  if (
    range &&
    !isFocusingAndChange &&
    range.startOffset === range.endOffset
  ) {
    let t = range.endContainer;
    const dom = [];
    if (t === source) {
      const targetDom = t.childNodes[range.endOffset];
      if (targetDom instanceof HTMLBRElement) {
        console.log(
          (targetDom).getAttribute('data-index'),
        );
      }
    } else {
      while (t && !(t instanceof HTMLBRElement)) {
        dom.push(t);
        t = t?.previousSibling;
      }
      if (t instanceof HTMLBRElement) {
        const endIndex = t.getAttribute('data-index');
        // const totalText = dom.map((x) => x.textContent).join('');
        const restEndIndex =
          Number(endIndex) + range.endOffset + 1;
        if (!_.isNil(endIndex)) {
          console.log(restEndIndex);
        }
      } else {
        console.log(range.endOffset);
      }
    }
  }

})


function ensureDomOnlyTextAndBr(str) {
  source.innerHTML = relaceTextToHtml(str ?? source.innerText)
  const nodeList = [...source.childNodes];
  const list = [];
  let hadMerge = false;
  for(const x of nodeList) {
    if (x instanceof HTMLBRElement || (x instanceof Text)) {
      list.push(x)
    } else {
      hadMerge = true;
      const ret = []
      let newText = ''
      while(list.length && !(_.last(list) instanceof HTMLBRElement)) {
        let t = list.pop()
        ret.push(t)
        newText += t.textContent;
      }
      if (x instanceof HTMLSpanElement) {
        ret.push(x)
        newText += x.innerText;
      } else {
        console.warn('未处理的类型', x)
      }
      source.insertBefore(document.createTextNode(newText), x);
      _.forEach(ret, x => x.remove())
    }
  }
  if (hadMerge || (_.size(str) && str !== source.innerText)) {
   return ensureDomOnlyTextAndBr()
  }
  return source.innerText;
}

source.addEventListener(
  "blur",
  _.debounce(function (e) {
    setTimeout(() => {
      isFocusingAndChange = false;
      localStorage.removeItem('ast-temp');
      if (shouldHandleWrapLine) {
        shouldHandleWrapLine = false;
        let str = ensureDomOnlyTextAndBr()
        writeSourceCodeAndRun(str)
        debounceSaveTokensLineMessage('onblur');
      }
    });
  }, 200)
);

source.addEventListener('paste', (e) => {
  console.log(e)
  e.stopPropagation();
  e.preventDefault();
  let text = e.clipboardData.getData('text/plain');
  if (document.queryCommandSupported('insertText')) {
    document.execCommand('insertText', false, text);
  } 
  [...source.childNodes].forEach(x => {
    if (x instanceof HTMLBRElement) {
      return 
    }
    if ( x instanceof Text) {
      return 
    }
    const dom = x;
    if (dom instanceof HTMLDivElement && _.size(dom.childNodes) === 1) {
      const textDom = document.createTextNode(x.innerText);
      const brDom = document.createElement('br');
      source.insertBefore(textDom, dom);
      source.insertBefore(brDom, textDom);
      const nextDom = dom.nextSibling
      if (nextDom instanceof HTMLDivElement &&
        _.size(nextDom.childNodes) > 1
        ) {
          source.insertBefore(document.createElement('br'), nextDom);
        }
      x.remove()
    } else {
      const nodeList = x.childNodes
      source.append(...nodeList)
      x.remove()
    }
    return ;
  })

  // e.clipboardData
  // e.preventDefault();

  // const newNode = document.createDocumentFragment()
  // const textList =  _.split(e.clipboardData.getData('text'), '\n')
  // let i = 0, len = textList.length;
  // const ret = []
  // for(;i < len; i++) {
  //   // TODO 可能还会有其他特殊符号，还不能直接替换。。。。
  //   const textNode = document.createTextNode(
  //     CookedToRaw( textList[i])
  //   );
  //   ret.push(textNode)
  //   if (i < len -1) {
  //     ret.push(document.createElement('br'));
  //   }
  // }
  // newNode.append(
  //   ...ret,
  // );
  // window.getSelection().getRangeAt(0).insertNode(newNode);
  // isFocusingAndChange = true;
  // let str = getSourceTextCodeFromHtml()
  // writeSourceCodeAndRun(str, true)
  // debounceSaveTokensLineMessage('onpaste.debounce')
  // shouldHandleWrapLine = true;
  // window.getSelection()?.removeAllRanges()
  
})

const openText = '当前关闭，点击打开';
const closeText = '当前开启, 点击关闭';
const stateOfCloseOrOpenDiffJson = 'stateOfCloseOrOpenDiffJson'

closeOrOpenDiffJson.innerText = process.env.mode !== 'development' ? openText : localStorage.getItem(stateOfCloseOrOpenDiffJson) ?? closeText;

closeOrOpenDiffJson.addEventListener('click', () => {
  if (process.env.mode !== 'development') {
    return console.warn('npm run dev 开启才能自动获取json对比')
  }
  const origin = closeOrOpenDiffJson.innerText;
  const newText = origin === openText ? closeText : openText;
  localStorage.setItem(stateOfCloseOrOpenDiffJson, newText)
  closeOrOpenDiffJson.innerText = newText;
  location.reload();
})

if (process.env.mode === 'development' && closeOrOpenDiffJson.innerText === closeText) {
  const targetUrl = 'https://astexplorer.net/';
  let testWindow
  setTimeout(() => {
    testWindow = window.open(targetUrl);
    setTimeout(() => {
      testWindow?.postMessage?.({
        type: 'localhost',
        data: currentSourceCodeStr,
      }, '*');
    }, 2000)
  }, 4000)
  window.onmessage = (x) => {
    if (x.data.type === targetUrl) {
      console.log('%c%o', 'color: red', _.T(x.data.data))
    }
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      // 页面被隐藏时的操作
      //  channel.postMessage(currentSourceCodeStr)
      testWindow?.postMessage?.({
        type: 'localhost',
        data: currentSourceCodeStr,
      }, '*');
    }
  });

  window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.returnValue = '';
    testWindow?.close?.()
  })
}


const inputAst = function (e) {
  // console.log(e.target.value)
  const ast = JSON.parse(e.target.value);
  source.innerHTML = ensureDomOnlyTextAndBr(generateCode(ast, { [DEBUGGER_DICTS.isHTMLMode]: true }));
  AST.testingCode = '';
  console.clear()
  writeAstAndRun(ast)
  localStorage.setItem('ast-temp', JSON.stringify(ast));
}

paste.onclick = async (e) => {
  const value = await navigator.clipboard.readText();
  astJsonContainer.innerHTML = value;
  setLoop(0)
  console.clear();
  Environment.envId = 1;
  inputAst({
    target: {
      value
    }
  })
}

astJsonContainer.addEventListener(
  "input",
  inputAst,
);

const changeSourceCodeContent = (text) => {
  let str = ensureDomOnlyTextAndBr(text);
  source.focus();
  writeSourceCodeAndRun(str)
  saveTokensLineMessage('window.load')
}


mode.addEventListener(
  'change',
  (e) => {
    AST.selectMethod = e.target.value
    changeSourceCodeContent(textList.getText(e.target.value))
  }
)

window.addEventListener("load", () => {
  const methods = Reflect.ownKeys(AST.prototype)
    .reverse()
    .filter((x) => x.startsWith("is")).sort();
  const Fragment = document.createDocumentFragment()

  let selectedOptions = null
  for (const x of methods) {
    const option = document.createElement('option')
    const text = document.createElement('text')
    text.textContent = x
    if (x === AST.selectMethod) {
      option.selected = true
      selectedOptions = option;
    }
    option.appendChild(text)
    Fragment.appendChild(option)
  }
  mode.appendChild(Fragment)
  if (localStorage.getItem('ast-temp')) {
    if (selectedOptions) {
      selectedOptions.selected = false;
      const option = document.createElement('option')
      const text = document.createElement('text')
      text.textContent = '使用上次ast缓存'
      option.selected = true;
      option.appendChild(text)
      mode.appendChild(option)
    }
    const text = localStorage.getItem('ast-temp')
    astJsonContainer.innerHTML = text;
    // console.log(typeof astJsonContainer.value)
    astJsonContainer.focus()
    inputAst({
      target: {
        value: text,
      }
    })
  } else {
    changeSourceCodeContent(textList.getText(AST.selectMethod))
  }
});
