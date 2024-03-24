import Environment from ".."
import parseAst from "../.."
import { isInstanceOf, log } from "../../../commonApi"
import { isAwaitError } from "../../Parse/parseAwaitExpression"
import { getYieldEnv, getYieldValue, isYieldError } from "../../Parse/parseYieldExpression"
import { RUNTIME_VALUE_DICTS } from "../../constant"
import RuntimeValue, { RuntimeGeneratorInstanceValue, RuntimePromiseInstanceValue } from "../RuntimeValue"
import { createGeneratorInstance, createObject, getFalseV, getGenerateFn, getTrueV, getUndefinedValue } from "../RuntimeValueInstance"
import parseRuntimeValue from "../parseRuntimeValue"
import { PromiseRvReject, PromiseRvResolve, PromiseRvThen, createIdentifierAst, createPromiseRvAndPromiseResolveCallback, createRuntimeValueAst, getGenerateInstanceConfig } from "../utils"
import { getJsSymbolIterator } from "./symbol"

let generatorRv

let generatorPrototypeRv

export function getGeneratorPrototypeRv() {
  if (!generatorPrototypeRv) {
    const generateFn = getGenerateFn()
    const throwE = (_this, errRv) => {
      const generateConfig = _this.getGenerateConfig()
        const env = generateConfig.getYieldEnv();
        if (env) { 
          env.envStackStore.setError(errRv)
        } else {
          generateConfig.setPendingErrorValue(errRv);
        }
    }
    const handle = (nextRv, _this, env, type, lastRes, lastRej) => {
      
      const generateConfig = _this.getGenerateConfig()
      const isPureAsync = generateConfig.isPureAsync();
      const canAwaitable = generateConfig.canAwaitable()
      const undefinedRv = getUndefinedValue()
      const run = (nextRv, promiseResolveCallback, promiseRejectCallback) => {
        // console.log('开始run')
        let tempE = null;
        generateConfig.setNextValue(nextRv ?? undefinedRv);
        let value = undefinedRv;
        try {
          value = generateConfig.runGeneratorFunction();
        } catch (e) {
          if (isYieldError(e)) {
            tempE = e;
            value = getYieldValue(e)
            generateConfig.setYieldEnv(getYieldEnv(e))
          } else {
            generateConfig.done = true;
            generateConfig.clearPromiseCallbackList(env, 1)
            if (canAwaitable) {
              promiseRejectCallback(e, env)
            } else {
              throw e;
            }
          }
        }
        const doneRv = generateConfig.done ? getTrueV() : getFalseV();

        if (canAwaitable) {
          const stepRv = isPureAsync ? value : createObject({
            value,
            done: doneRv,
          });
          if (tempE && isAwaitError(tempE)) {
            const retRv = PromiseRvThen({
              promiseInstanceRv:  PromiseRvResolve(value, env),
              thenCb: ([resRv]) => {
                run(resRv, promiseResolveCallback, promiseRejectCallback)
              },
              thenCbIntroduction: 'async$generator$auto$then$callback',
              catchCbIntroduction: 'async$generator$auto$catch$callback',
              catchCb: ([e], { env }) => {
                // const p1 = 
                // return p1;
                throwE(_this, e)
              
                PromiseRvThen({
                  env,
                  promiseInstanceRv: handle(e, _this, env, 'throw', promiseResolveCallback, promiseRejectCallback),
                  catchCb: () => {
                    // 做一个空的catch
                  },
                })
              },
              env
            })

            if (generateConfig.isNotPendingPromiseNextValue()) {
              generateConfig.setPendingPromiseNextValue(retRv)
            }
            return retRv;
          }

          if (generateConfig.done) {
            generateConfig.clearPromiseCallbackList(env, 0);
          } 
          promiseResolveCallback(stepRv, env);
          if (!isPureAsync) {
            const retRv = PromiseRvResolve(stepRv, env);  
            if (generateConfig.isNotPendingPromiseNextValue()) {
              generateConfig.setPendingPromiseNextValue(retRv)
            }
            return retRv;
          }
        }

        return  createObject({
          value,
          done: doneRv,
        });
      }
      if (canAwaitable) {
        const lastPromiseRv = generateConfig.getPendingPromiseNextValue()
        // console.log('lastPromiseRv', lastPromiseRv)
        const { promiseRv, promiseResolveCallback, promiseRejectCallback } = createPromiseRvAndPromiseResolveCallback(env)
        generateConfig.setPendingPromiseNextValue(promiseRv);
        const isThrowErrorType = type === 'throw'
        if (!isThrowErrorType && isInstanceOf(lastPromiseRv, RuntimePromiseInstanceValue)) {
          // console.log('开始判断上一个promise的状态')
          if (!generateConfig.done) {
            PromiseRvThen({
              env,
              promiseInstanceRv: lastPromiseRv,
              thenCb: () => {
                run(nextRv, promiseResolveCallback, promiseRejectCallback)
              },
              catchCb: ([e], { env }) => {
                // TODO 失败的情况
                // run(nextRv, promiseResolveCallback, promiseRejectCallback)
              },
            })
          }
        } else {
          // TODO 可能要做调整
          run(nextRv,isThrowErrorType  ? (...args) => {
            promiseResolveCallback(...args);
            lastRes(...args)
          } : promiseResolveCallback, isThrowErrorType ? (...args) => {
            promiseRejectCallback(...args);
            lastRej(...args)
          } : promiseRejectCallback);
        }
        
        if (!isPureAsync) {
        const { 
          promiseRv: promiseRv2, 
          promiseResolveCallback: promiseResolveCallback2,
          promiseRejectCallback: promiseRejectCallback2
         } = createPromiseRvAndPromiseResolveCallback(env)
        PromiseRvThen({
          env,
          promiseInstanceRv: promiseRv,
          thenCb: ([argsRv]) => {
            generateConfig.pendingResolveCallbackList.shift()
            promiseResolveCallback2(argsRv, env);
          },
          catchCb: ([e], { env }) => {
            promiseRejectCallback2(e, env)
          },
        });
        generateConfig.pendingResolveCallbackList.push([
          promiseResolveCallback, 
          promiseResolveCallback2,
          promiseRejectCallback,
          promiseRejectCallback2,
        ])
        return promiseRv2;
       }
  
        // console.warn('promiseRv2', promiseRv2)
        return promiseRv
      }
      return run(nextRv)
    }
    generatorPrototypeRv = createObject({
      next: generateFn('Generator$next', ([nextRv], { _this, env }) => {
        if (!isInstanceOf(_this, RuntimeGeneratorInstanceValue)) {
          throw new Error('不是generator实例')
        }
        return handle(nextRv, _this, env, 'next');
      }),
      return: generateFn('Generator$return', ([retRv], { _this }) => {
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
        
        return handle(getUndefinedValue(), _this, env, 'return');
      }),
      throw: generateFn('Generator$throw', ([errRv], { _this }) => {
        if (!isInstanceOf(_this, RuntimeGeneratorInstanceValue)) {
          throw new Error('不是generator实例')
        }
        throwE(_this, errRv)
        
        return handle(getUndefinedValue(), _this, env, 'throw');
      }),
      [getJsSymbolIterator()]: generateFn('Generator$Symbol$Iterator', ([], { _this }) => {
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