import { input } from "./test"
import transform from "./transform"

const throttle = (fn,t) => {
  let timer = null
  return function (...args){
     if(timer) {
       return
     }
     timer = setTimeout((() => {
      fn.call(this, ...args)
      timer = null
     }), t)
  }
}

source.addEventListener('input',throttle(function(e){
  result.value = transform(e.target.value)
}, 200))

window.addEventListener('load', () => {
  result.value = transform(input)
  source.focus()
})
