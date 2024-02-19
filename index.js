import { textList } from "./test";
import transform from "./transform";
import { AST } from "./transform/getAst";
import Ast from './transform/runtime/ast/index';
import parseAst, { setLoop } from "./transform/runtime";
import Environment from "./transform/runtime/Environment";
import { getWindowEnv } from "./transform/runtime/Environment/getWindow";
import generateCode from "./transform/runtime/Generate";
import writeJSON, { textReplace } from "./transform/util";
import { DEBUGGER_DICTS } from "./transform/runtime/constant";
import { createPromiseRvAndPromiseResolveCallback } from "./transform/runtime/Environment/utils";
import { copyToClipboard, debounceCopyToClipboard, diffStr, isInstanceOf } from "./transform/commonApi";
import ASTItem from "./transform/runtime/ast/ASTITem";
import { getYieldValue, isYieldError } from "./transform/runtime/Parse/parseYieldExpression";
import { RuntimeAwaitValue } from "./transform/runtime/Environment/RuntimeValue";
import parseRuntimeValue from "./transform/runtime/Environment/parseRuntimeValue";
import { innerParseProgram } from "./transform/runtime/Parse/parseProgram";

source.onscroll = _.throttle((x) => {
  const dom = document.getElementById('currentDebuggerSpan');
  if (dom) {
    const { left, top, width } = dom.getBoundingClientRect()
    debuggerScene.style.left = `${left + width}px`;
    debuggerScene.style.top = `${top}px`;
  }
  source_copy.scrollTop = source.scrollTop;
}, 50, {
  leading: false,
  trailing: true
})

debuggerBtn.onclick = () => {
  // console.log('点击');
  const debuggerScene = document.getElementById('debuggerScene');
  // if (debuggerScene.parentNode) {
  //   debuggerScene.parentNode.removeChild(debuggerScene)
  //   document.body.appendChild(debuggerScene);
  // }

  debuggerScene.style.opacity = 0;
}

const throttle = (fn, t) => {
  let timer = null;
  return function (...args) {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.call(this, ...args);
      timer = null;
    }, t);
  };
};

const writeAst = (ast) => {
  // console.clear();
  result.value = "{\n" + writeJSON(ast, 2, {
    [DEBUGGER_DICTS.isStringTypeUseQuotationMarks]: false,
    [DEBUGGER_DICTS.isTextMode]: true
  }).join("") + "}";

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
  runCode();
  excute.innerHTML = '正在写入环境中，请稍等';

  requestIdleCallback(() => {
    console.time('写操作花费时间')
    excute.innerHTML = textReplace("{\n" + writeJSON(win.toWrite(), 2, {
      [DEBUGGER_DICTS.isStringTypeUseQuotationMarks]: true,
      [DEBUGGER_DICTS.isHTMLMode]: true,
      [DEBUGGER_DICTS.onlyShowEnvName]: false
    }).join("") + "}");
    // console.log(win)
    console.timeEnd('写操作花费时间')
  })
  // const test = new Ast()
  // test.setSourceCode(`
  // this.type === 'Literal'
  // && 1 === 1
  // && this.parent.left.operator === 'typeof'`)

  // console.log(test.getAst())
}

const astInstance = new Ast()

function innerChange(x) {
  if (isInstanceOf(x, ASTItem)) {
    const obj = {}
    for (const t in x) {
      if (t === 'tokens') {
        continue;
      }
      obj[t] = innerChange(x[t])
    }
    return obj;
  }
  if (Array.isArray(x)) {
    return _.map(x, innerChange)
  }
  return x;
}

function simpleChange(x) {
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

        obj[t] = simpleChange(x[t])
      }
    }
    return obj;
  }
  if (Array.isArray(x)) {
    return _.map(x, simpleChange)
  }
}

let innerSimpleAstSourcecode = ""
const write = (text) => {
  // const ast = transform(text);
  // let newText = '';
  // let cnt = 0;
  // for(const c of text) {
  //     if (c === '\n') {
  //       cnt ++;
  //     } else {
  //       cnt = 0;
  //     }
  //     if (cnt === 0 || cnt % 2 === 1) {
  //       newText +=c;
  //     }
  //   }
  astInstance.markSourceCode(text);
  try {
    source_copy.innerHTML = '';
    const ast = astInstance.getAst();
    const generateText = _.map(ast.tokens, 'value').join('')
    if (text !== generateText) {
      console.warn(astInstance.astContext, ast,text.length, generateText.length, [text, generateText], diffStr(text, generateText))
      throw new Error('token 漏了');
    }
    const simpleAst = _.T(ast, true)
    innerSimpleAstSourcecode = (text);
    console.log([ast, simpleChange(ast), simpleAst])
    writeAst(innerChange(ast));
  } catch (err) {
    const e = _.get(err, 'errorInfo', {});
    if (Array.isArray(e.charList)) {
      console.log(e)
      // const prefixSpaceList = _.map(e.errorToken.prefixTokens,
      //   'value'
      //   );
      // const textHtml = [..._.map(e.charList, 'char'),...prefixSpaceList].join('');
      const { start, end } = e.errorToken;
      const change = (str) => _.reverse(_.split(_.replace(_.replace(_.reverse((str).split('')).join(''), /\n\n/g, '>vid/<>/rb<>vid<'), /\n/g, '>/rb<'), '')).join('');

      const html = change(_.slice(text, 0, start).join('')) + `<span style="border-bottom: 3px solid red;">${e.errorToken.value
        }</span>` + change(_.slice(text, end + 1).join(''));

      source_copy.innerHTML = html;
      // console.log(textHtml)
      // requestAnimationFrame(() => {
      //   source_copy.innerHTML += `<span style="border-bottom: 3px solid red;">${
      //     e.errorToken.value
      //   }</span>${_.slice(e.restSourceCode, _.size(prefixSpaceList) + _.size( e.errorToken.value), -1).join('')}`
      //   // requestAnimationFrame(() => {
      //   //   source_copy.innerText += 
      //   // })
      // })
    }
    console.error(err);
  }
}


source.addEventListener(
  "input",
  throttle(function (e) {
    setTimeout(() => {
      localStorage.removeItem('ast-temp');
      write(source.innerText)
    });
  }, 1000)
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
  const newText =  origin === openText ? closeText :openText;
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
        data: innerSimpleAstSourcecode,
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
      //  channel.postMessage(innerSimpleAstSourcecode)
      testWindow?.postMessage?.({
        type: 'localhost',
        data: innerSimpleAstSourcecode,
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
  source.innerHTML = textReplace(generateCode(ast, { [DEBUGGER_DICTS.isHTMLMode]: true }));
  AST.testingCode = '';
  console.clear()
  writeAst(ast)
  localStorage.setItem('ast-temp', JSON.stringify(ast));
}

paste.onclick = async (e) => {
  const value = await navigator.clipboard.readText();
  result.innerHTML = value;
  setLoop(0)
  console.clear();
  Environment.envId = 1;
  inputAst({
    target: {
      value
    }
  })
}

result.addEventListener(
  "input",
  inputAst,
);

const change = (text) => {
  source.innerHTML = textReplace(text);
  source.focus();
  write(text)
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
    result.value = localStorage.getItem('ast-temp')
    // console.log(typeof result.value)
    result.focus()
    inputAst({
      target: {
        value: result.value,
      }
    })
  } else {
    change(textList.getText(AST.selectMethod))
  }
});
