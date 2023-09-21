import parseAst from "../.."
import { isInstanceOf } from "../../../commonApi"
import { getYieldEnv, getYieldValue, isYieldError } from "../../Parse/parseYieldExpression"
import { RuntimeGeneratorInstanceValue } from "../RuntimeValue"
import { createGeneratorInstance, createObject, getFalseV, getGenerateFn, getUndefinedValue } from "../RuntimeValueInstance"
import parseRuntimeValue from "../parseRuntimeValue"
import { getGenerateInstanceConfig, instanceOfRuntimeValue } from "../utils"

let generatorRv 

let contextRv

let generatorPrototypeRv

export function getContextRv() {
  if (!contextRv) {
    const generateFn = getGenerateFn()
    contextRv = generateFn('GeneratorContext', () => {
      return createObject({
        done: getFalseV(),
        value: getUndefinedValue(),
      })
    })
  }
  return contextRv;
}

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
      return: generateFn('Generator$return',([argsRv], {_this}) => {
        if (!isInstanceOf(_this, RuntimeGeneratorInstanceValue)) {
          throw new Error('不是generator实例')
        }
        const generateConfig = _this.getGenerateConfig()
        const env = generateConfig.getYieldEnv();
        console.log('接受到的实例', argsRv, env);
        if (env) {
          env.setCurrentEnvReturnValue(argsRv)
        } else {
          generateConfig.setPendingReturnValue(argsRv);
        }
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
        // todo
        return createObject({
          value,
          done: generateConfig.done,
        })
      })
    })
  }
  return generatorPrototypeRv;
}

export default function getGeneratorRv() {
  if (!generatorRv) {
    const generateFn = getGenerateFn()
    generatorRv = generateFn('GeneratorFunction', (rvList) => {
      return createGeneratorInstance({}, getGenerateInstanceConfig(rvList))
    })
  }
  return generatorRv
}