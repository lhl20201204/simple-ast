import { RUNTIME_VALUE_DICTS, RUNTIME_VALUE_TYPE } from "../../constant";
import { getPromisePrototypeRv } from "../NativeRuntimeValue/promise";
import { RuntimePromiseInstanceValue } from "../RuntimeValue";
import { createString, getFunctionPrototypeRv } from "../RuntimeValueInstance";
import { getWindowEnv } from "../getWindow";


export default function createPromiseInstanceRv(config) {
  config[RUNTIME_VALUE_DICTS.proto] = getPromisePrototypeRv()
  return new RuntimePromiseInstanceValue(RUNTIME_VALUE_TYPE.object, {
    [RUNTIME_VALUE_DICTS.PromiseState]: createString('pending')
  }, config)
}