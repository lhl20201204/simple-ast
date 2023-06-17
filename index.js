import { textList } from "./test";
import transform from "./transform";
import { AST } from "./transform/getAst";
import parseAst from "./transform/runtime";
import { getWindowEnv } from "./transform/runtime/Environment/getWindow";
import generateCode from "./transform/runtime/Generate";
import writeJSON from "./transform/util";

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
  result.value = "{\n" + writeJSON(ast, 2, false).join("") + "}";
  const win = getWindowEnv();
  parseAst(ast, win);
  excute.value = "{\n" + writeJSON(win.toString(), 2, true).join("") + "}";
  console.log(win)
}

const write = (text) => {
  const ast = transform(text);
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
  console.log(e.target.value)
  const ast = JSON.parse(e.target.value);
  source.innerHTML = textReplace(generateCode(ast));
  AST.testingCode = '';
  writeAst(ast)
  localStorage.setItem('ast-temp', JSON.stringify(ast));
}

result.addEventListener(
  "input",
  inputAst,
);
function textReplace(text) {
  let t = text.replaceAll('\n', '<br/>')
  return t;
}

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
    console.log(typeof result.value)
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
