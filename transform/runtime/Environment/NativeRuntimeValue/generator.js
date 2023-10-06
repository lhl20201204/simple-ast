import parseAst from "../.."
import { isInstanceOf } from "../../../commonApi"
import { errorRuntimeValueToJS } from "../../Parse/parseThrowStatement"
import { getYieldEnv, getYieldValue, isYieldError } from "../../Parse/parseYieldExpression"
import { RUNTIME_VALUE_DICTS } from "../../constant"
import RuntimeValue, { RuntimeGeneratorInstanceValue } from "../RuntimeValue"
import { createGeneratorInstance, createObject, getFalseV, getGenerateFn, getUndefinedValue } from "../RuntimeValueInstance"
import parseRuntimeValue from "../parseRuntimeValue"
import { getGenerateInstanceConfig, instanceOfRuntimeValue } from "../utils"
import { getJsSymbolIterator, getSymbolIteratorRv } from "./symbol"

let generatorRv 

let generatorPrototypeRv

export function getGeneratorPrototypeRv() {
  if (!generatorPrototypeRv) {
    const generateFn = getGenerateFn()
    generatorPrototypeRv = createObject({
      next: generateFn('Generator$next', ([nextRv], { _this }) => {
        if (!isInstanceOf(_this, RuntimeGeneratorInstanceValue)) {
          throw new Error('不是generator实例')
        }
        const generateConfig = _this.getGenerateConfig()
        generateConfig.setNextValue(nextRv ?? getUndefinedValue());
        let value = getUndefinedValue()
        try{
           value = generateConfig.runGeneratorFunction();
        } catch(e) {
          if (isYieldError(e)) {
            value = getYieldValue(e)
            generateConfig.setYieldEnv(getYieldEnv(e))
          } else {
            throw e;
          }
        }
        
        return createObject({
          value,
          done: generateConfig.done,
        })
      }),
      return: generateFn('Generator$return',([retRv], {_this}) => {
        if (!isInstanceOf(_this, RuntimeGeneratorInstanceValue)) {
          throw new Error('不是generator实例')
        }
        const generateConfig = _this.getGenerateConfig()
        const env = generateConfig.getYieldEnv();
        if (env) {
          env.setCurrentEnvReturnValue(retRv)
        } else {
          generateConfig.setPendingReturnValue(retRv);
        }
        let value = getUndefinedValue()
        try{
          if (generateConfig.done) {

            value = retRv;
          } else {
            value = generateConfig.runGeneratorFunction();
          }
        } catch(e) {
          if (isYieldError(e)) {
            value = getYieldValue(e)
            generateConfig.setYieldEnv(getYieldEnv(e))
          } else {
            throw e;
          }
        }
        // todo
        return createObject({
          value,
          done: generateConfig.done,
        })
      }),
      throw: generateFn('Generator$throw', ([errRv], {_this}) => {
        if (!isInstanceOf(_this, RuntimeGeneratorInstanceValue)) {
          throw new Error('不是generator实例')
        }
        const generateConfig = _this.getGenerateConfig()
        const env = generateConfig.getYieldEnv();
        if (env) {
          env.envStackStore.setError(errRv)
        } else {
          generateConfig.setPendingErrorValue(errRv);
        }
        let value = getUndefinedValue()
        try{
          if (generateConfig.done) {
            throw errRv;
          } else {
            value = generateConfig.runGeneratorFunction();
          }
        } catch(e) {
          if (isYieldError(e)) {
            value = getYieldValue(e)
            generateConfig.setYieldEnv(getYieldEnv(e))
          } else {
            throw e;
          }
        }
        // todo
        return createObject({
          value,
          done: generateConfig.done,
        })
      }),
      [getJsSymbolIterator()]: generateFn('Generator$Symbol$Iterator', ([], {_this}) => {
        return _this;
      })
    })
  }
  return generatorPrototypeRv;
}

export default function getGeneratorRv() {
  if (!generatorRv) {
    const generateFn = getGenerateFn()
    generatorRv = generateFn('GeneratorFunction', (rvList) => {
      const config = getGenerateInstanceConfig(rvList);
      const ret = createGeneratorInstance({
        [RUNTIME_VALUE_DICTS.GeneratorFunction]: config.GeneratorFunctionRv,
      }, config)
    
      return ret
    })
  }
  return generatorRv
}