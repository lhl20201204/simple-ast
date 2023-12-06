import parseAst from "../.."
import { isInstanceOf } from "../../../commonApi"
import { isAwaitError } from "../../Parse/parseAwaitExpression"
import { errorRuntimeValueToJS } from "../../Parse/parseThrowStatement"
import { getYieldEnv, getYieldValue, isYieldError } from "../../Parse/parseYieldExpression"
import { RUNTIME_VALUE_DICTS } from "../../constant"
import createPromiseInstanceRv from "../Promise"
import RuntimeValue, { RuntimeGeneratorInstanceValue, RuntimePromiseInstanceValue } from "../RuntimeValue"
import { createGeneratorInstance, createObject, createString, getFalseV, getGenerateFn, getTrueV, getUndefinedValue } from "../RuntimeValueInstance"
import parseRuntimeValue from "../parseRuntimeValue"
import { PromiseRvResolve, PromiseRvThen, consolePromiseRv, createRuntimeValueAst, getGenerateInstanceConfig, instanceOfRuntimeValue } from "../utils"
import { getPromiseRv } from "./promise"
import { getJsSymbolIterator, getSymbolIteratorRv } from "./symbol"

let generatorRv 

let generatorPrototypeRv

export function getGeneratorPrototypeRv() {
  if (!generatorPrototypeRv) {
    const generateFn = getGenerateFn()
    generatorPrototypeRv = createObject({
      next: generateFn('Generator$next', ([nextRv], rest) => {
        const  { _this, env } = rest;
        if (!isInstanceOf(_this, RuntimeGeneratorInstanceValue)) {
          throw new Error('不是generator实例')
        }
        // console.warn('开始next', parseRuntimeValue(nextRv))

        const generateConfig = _this.getGenerateConfig()
        const canAwaitable = generateConfig.canAwaitable()
        
        const run = (nextRv) => {
          let tempE = null;
          generateConfig.setNextValue(nextRv ?? getUndefinedValue());
          let value = getUndefinedValue()
          try{
             value = generateConfig.runGeneratorFunction();
          } catch(e) {
            if (isYieldError(e)) {
              tempE = e;
              value = getYieldValue(e)
              generateConfig.setYieldEnv(getYieldEnv(e))
            } else {
              throw e;
            }
          }
          const doneRv = generateConfig.done ? getTrueV() : getFalseV();
  
  
          if (canAwaitable) {
            const stepRv = createObject({
              value,
              done: doneRv,
            });
            
            if (tempE && isAwaitError(tempE)) {
              // console.log('遇到await自动开始')
              // consolePromiseRv(value, env)
              
              // return (parseAst({
              //   type: 'CallExpression',
              //   callee: {
              //     type: 'MemberExpression',
              //     object: createRuntimeValueAst(_this, 'async$generator$auto$_this'),
              //     property: createRuntimeValueAst(createString('next'), 'next'),
              //     computed: false,
              //     optional: false,
              //   },
              //   arguments: [
              //     createRuntimeValueAst(value, 'async$generator$Value')
              //   ]
              // }, env));
              let retRv = PromiseRvThen({
                promiseInstanceRv: PromiseRvResolve(value, env),
                thenCb: ([resRv]) => run(resRv),
                thenCbIntroduction: 'async$generator$auto$then$callback',
                env
              })

              if (generateConfig.isNotPendingPromiseNextValue()) {
                generateConfig.setPendingPromiseNextValue(PromiseRvThen({
                  promiseInstanceRv: retRv,
                  env,
                  thenCb: ([x]) => {
                    console.log('xxxx', x)
                    return x;
                  },
                }))
                // retRv = PromiseRvThen({
                //   promiseInstanceRv: retRv,
                //   thenCb: ([x]) => { 
                //     console.log('yield')
                //     return x
                //   },
                //   thenCbIntroduction: '_innerCallback',
                //   env
                // });
              }
              // consolePromiseRv(retRv, env)
              return retRv;
            } 
  
            let retRv = PromiseRvResolve(stepRv, env);

            if (generateConfig.isNotPendingPromiseNextValue()) {
              generateConfig.setPendingPromiseNextValue(retRv)
              // retRv = PromiseRvThen({
              //   promiseInstanceRv: retRv,
              //   thenCb: ([x]) => { 
              //     return x
              //   },
              //   thenCbIntroduction: '_innerCallback',
              //   env
              // });
            }
            return retRv;
          }
          return createObject({
            value,
            done: doneRv,
          })
        }
        const lastPromiseRv = generateConfig.getPendingPromiseNextValue()

        if (canAwaitable && isInstanceOf(lastPromiseRv, RuntimePromiseInstanceValue)) {
          const retRv= PromiseRvThen({
            env,
            promiseInstanceRv: lastPromiseRv,
            thenCb: () => {
              return run(nextRv)
          }
           });

          generateConfig.setPendingPromiseNextValue(retRv)
          return retRv;
        }
        return run(nextRv)
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
          done: generateConfig.done ? getTrueV() : getFalseV(),
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
          done: generateConfig.done ? getTrueV() : getFalseV(),
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