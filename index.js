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
  for(const [, [, nodesStr]] of arr) {
    if (nodesStr !== '\n') {
      ret.push('<span>&nbsp;</span>');
    } else {
      ret.push('<br/>');
    }
  }
  const currentLineItem = totalArr[sRow]
  const  [,lineStr] = currentLineItem[1];
  console.error({currentLineItem, totalArr, index, str: currentLineItem[1]});
  return ret.join('') + lineStr.slice(0, sCol)
}

let currentSourceCodeStr = ""
let currentAstWithoutStartEnd = {}

const debounceThrowError = _.debounce((err) => {
  requestIdleCallback(() => {
    const e = _.get(err, 'errorInfo', {});
    if (Array.isArray(e.charList)) {
      const { start, end } = e.errorToken;
      Reflect.defineProperty(e, '点击跳转到错误的token', {
        get () {
          selectStartEnd(start, end)
        }
      })
      console.log(e)
      const html =`<div>${
        getErrorInfoPrefixContent(start) + `<span style="border-bottom: 3px solid red;">${e.errorToken.value
        }</span>` 
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
    let nextAstWithoutStartEnd =  omitAttrsDfs(ast, ['tokens', 'start', 'end']);
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
    let len = currentSourceCodeStr.length;
    let childNodeIndex = 0;
    const map = window.tokenIndexToDomMap;
    map.clear()
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
    if(_.map([...map], '1.1').join('') !== currentSourceCodeStr) {
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

source.addEventListener('keypress', function(e) {
  if (e.code === 'Enter') {
      e.preventDefault();
      const selection = window.getSelection();
      if (selection) {
        const t =  selection.getRangeAt(0);
        if (isInstanceOf(t.endContainer, Text) && t.endOffset === _.size(t.endContainer)) {
          document.execCommand('insertHTML', false, '<br/><br/>');
          return;
        }
      }
      document.execCommand('insertHTML', false, '<br/>');
     return;
  }
})

source.addEventListener(
  'input',
  _.throttle((e) => {
    let str = getSourceTextCodeFromHtml()
    writeSourceCodeAndRun(str, true)
    debounceSaveTokensLineMessage('oninput.debounce')
    shouldHandleWrapLine = true;
  }, 200)
)

function getSourceTextCodeFromHtml(bol) {
  let str = source.innerText
  if ( bol) {
    str = str.replace(/\n{2,2}/g, '\n');
  }
  return str;
}

source.addEventListener(
  "blur",
  _.debounce(function (e) {
    setTimeout(() => {
      localStorage.removeItem('ast-temp');
      let str = getSourceTextCodeFromHtml()
      if (shouldHandleWrapLine) {
        shouldHandleWrapLine = false;
        writeSourceCodeAndRun(str)
        source.innerHTML = relaceTextToHtml(str)
        debounceSaveTokensLineMessage('onblur');
      }
    });
  }, 200)
);

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
  source.innerHTML = relaceTextToHtml(generateCode(ast, { [DEBUGGER_DICTS.isHTMLMode]: true }));
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

const change = (text) => {
  source.innerHTML = relaceTextToHtml(text);
  source.focus();
  let str = getSourceTextCodeFromHtml(true)
  writeSourceCodeAndRun(str)
  source.innerHTML = relaceTextToHtml(str)
  saveTokensLineMessage('window.load')
}


mode.addEventListener(
  'change',
  (e) => {
    AST.selectMethod = e.target.value
    change(textList.getText(e.target.value))
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
    change(textList.getText(AST.selectMethod))
  }
});
