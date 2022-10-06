import { textList } from "./test";
import transform from "./transform";
import { AST } from "./transform/getAst";

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

source.addEventListener(
  "input",
  throttle(function (e) {
    setTimeout(() => {
      result.value = transform(e.target.value);
    });
  }, 1000)
);

const change = (text) => {
  source.value = text;
  source.focus();
  result.value = transform(text);
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

  for (const x of methods) {
    const option = document.createElement('option')
    const text = document.createElement('text')
    text.textContent = x
    if (x === AST.selectMethod) {
      option.selected = true
    }
    option.appendChild(text)
    Fragment.appendChild(option)
  }
  mode.appendChild(Fragment)
  change(textList.getText(AST.selectMethod))
});
