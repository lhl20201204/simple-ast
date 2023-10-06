import { createNumber, getGenerateFn, getUndefinedValue, runFunctionRuntimeValueInGlobalThis } from "../RuntimeValueInstance"
import { getWindowEnv } from "../getWindow";
import { createRuntimeValueAst, getIterableRvOfGeneratorInstanceOfNext } from "../utils";

let forEachRv

export function getForEachRv() {
  if (!forEachRv) {
    const generateFn = getGenerateFn()
    forEachRv = generateFn('forEach', ([cbRv], { _this, env }) => {
      const { getLatestDoneAndValueRv } = getIterableRvOfGeneratorInstanceOfNext(_this, env)
      let index = 0;
      let result = []
      let  { value, done } = getLatestDoneAndValueRv()
      while (!done) {
        const ret = runFunctionRuntimeValueInGlobalThis(
          createRuntimeValueAst(cbRv, 'foreach_callback'),
          getWindowEnv(),
          createRuntimeValueAst(value, 'value'),
          createRuntimeValueAst(createNumber(index++), 'index'),
          createRuntimeValueAst(_this, 'collection')
        )
        result.push(ret)
        const t = getLatestDoneAndValueRv();
        value = t.value
        done = t.done
      }
      return getUndefinedValue()
    })
  }
  return forEachRv;
}


