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

source.onscroll= _.throttle(() => {
  const dom =  document.getElementById('currentDebuggerSpan');
  if (dom) {
    const { left, top, width } = dom.getBoundingClientRect()
    debuggerScene.style.left = `${left + width}px`;
    debuggerScene.style.top =  `${top}px`;
  }
}, 50 , {
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
  parseAst(ast, win);
  excute.innerHTML = '正在写入环境中，请稍等';

  requestIdleCallback(() => {
    console.time('写操作花费时间')
    excute.innerHTML = textReplace("{\n" + writeJSON(win.toWrite(), 2, { 
      [DEBUGGER_DICTS.isStringTypeUseQuotationMarks]: true, 
      [DEBUGGER_DICTS.isHTMLMode]: true, 
      [DEBUGGER_DICTS.onlyShowEnvName]: false}).join("") + "}");
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

const write = (text) => {
  // const ast = transform(text);
  astInstance.markSourceCode(text);
  const ast = astInstance.getAst();
  console.log(ast)
  writeAst(ast);
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

const inputAst = function (e) {
  // console.log(e.target.value)
  const ast = JSON.parse(e.target.value);
  source.innerHTML = textReplace(generateCode(ast, { [DEBUGGER_DICTS.isHTMLMode]: true }));
  AST.testingCode = '';
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
  (e)=>{
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
    if(selectedOptions) {
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
