import { input } from "./test";
import transform from "./transform";

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
    })
  }, 1000)
);

window.addEventListener("load", () => {
  source.value = input;
  source.focus();
  result.value = transform(input);
});
