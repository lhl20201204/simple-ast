import { JSErrorToRuntimeValue } from "../../Parse/parseThrowStatement";
import { RUNTIME_VALUE_DICTS, RUNTIME_VALUE_TYPE } from "../../constant";
import { getPromisePrototypeRv } from "../NativeRuntimeValue/promise";
import { RuntimePromiseInstanceValue } from "../RuntimeValue";
import { createString, getFunctionPrototypeRv } from "../RuntimeValueInstance";
import { getWindowEnv } from "../getWindow";
import { createPromiseRvAndPromiseResolveCallback } from "../utils";


export default function createPromiseInstanceRv(config) {
  config[RUNTIME_VALUE_DICTS.proto] = getPromisePrototypeRv()
  const state = _.get(config, RUNTIME_VALUE_DICTS.PromiseState, 'pending')
  const value = {
    [RUNTIME_VALUE_DICTS.PromiseState]: createString(state)
  };
  if (state !== 'pending') {
    value[RUNTIME_VALUE_DICTS.PromiseResult] = _.get(config, RUNTIME_VALUE_DICTS.PromiseResult)
  }
  const ret =  new RuntimePromiseInstanceValue(RUNTIME_VALUE_TYPE.object, value, 
    _.omit(config, [RUNTIME_VALUE_DICTS.PromiseResult,RUNTIME_VALUE_DICTS.PromiseState]))
  
  // const promise = ret.getPromiseInstance();
  // const getHandle =(type, rv = getUndefinedValue()) => {
  //   // console.warn(type)
  //   ret.setPromiseResult(rv)
  //   ret.setPromiseState(createString(type))
  // }

  // (async () => {
  //   // 借助原生js的promise。。。
  //   try {
  //     const x = await promise;
  //     // console.warn(x, promise.state)
  //     getHandle('fulfilled', x)
  //   } catch(e) {
  //     e = JSErrorToRuntimeValue(e)
  //     getHandle('rejected', e)
  //     throw e;
  //   }
  // })();
  return ret;
}