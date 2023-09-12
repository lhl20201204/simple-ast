import { RUNTIME_VALUE_TYPE } from "../../constant";
import RuntimeValue from "../RuntimeValue";
import { createRuntimeValueAst } from "../utils";

let lookUpUndefinedRv

let beforeInitializationRv;

export function getLookUpUndefinedRv() {
  if (!lookUpUndefinedRv) {
    lookUpUndefinedRv = new RuntimeValue(RUNTIME_VALUE_TYPE.undefined, undefined)
  }
  return lookUpUndefinedRv;
}

export function isLookUpUndefinedRuntimeValue(rv) {
  return rv === getLookUpUndefinedRv()
}

export function createLookUpUndefinedAst() {
  return createRuntimeValueAst(getLookUpUndefinedRv(), 'undefined');
}

export function getBeforeInitializationRv() {
  if (!beforeInitializationRv) {
    beforeInitializationRv = new RuntimeValue(RUNTIME_VALUE_TYPE.string, 'before initialization')
  }
  return beforeInitializationRv;
}

export function isBeforeInitializationRuntimeValue(rv) {
  return rv === getBeforeInitializationRv()
}

export function createBeforeInitializationAst() {
  return createRuntimeValueAst(getBeforeInitializationRv(), 'before initialization');
}