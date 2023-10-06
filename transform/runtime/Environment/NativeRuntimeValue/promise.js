import parseAst from "../..";
import { isInstanceOf } from "../../../commonApi";
import { JSErrorToRuntimeValue, errorRuntimeValueToJS } from "../../Parse/parseThrowStatement";
import { RUNTIME_VALUE_DICTS } from "../../constant";
import createPromiseInstanceRv from "../Promise"
import RuntimeValue, { RuntimePromiseInstanceValue } from "../RuntimeValue";
import { createObject, createString, getGenerateFn, getUndefinedValue, runFunctionRuntimeValueInGlobalThis } from "../RuntimeValueInstance";
import { getWindowEnv } from "../getWindow";
import parseRuntimeValue from "../parseRuntimeValue";
import { createRuntimeValueAst, isFunctionRuntimeValue } from "../utils";

let rootPrv;

export function ensureHadPromise() {
  if (!rootPrv) {
    const generateFn = getGenerateFn()
    const PENDING = 'pending';
    const FULFILLED = 'fulfilled';
    const REJECTED = 'rejected';

    function getNewRuntimePromiseInstanceValue(_this, cb) {
      if (!isInstanceOf(_this, RuntimePromiseInstanceValue)) {
        throw new Error('Promise.then失败',)
      }
      const promise = _this.getPromiseInstance()
      const newPromise = new Promise((res, rej) => {
        promise.then(...cb((rv) => {
          res(rv)
        }, (e) => {
          e = JSErrorToRuntimeValue(e)
          rej(e)
        }))
      })
      newPromise.then((rv) => {
        retRv.setPromiseState(createString(FULFILLED))
        retRv.setPromiseResult(rv)
      }, (e) => {
        retRv.setPromiseState(createString(REJECTED))
        retRv.setPromiseResult(e)
      })
      const retRv = createPromiseInstanceRv({
        [RUNTIME_VALUE_DICTS.promiseInstance]: newPromise,
      })
      return retRv;
    }

    const promiseRv = generateFn('Promise', ([cbRv], { env }) => {
      let state = PENDING;
      const promise = new Promise((res, rej) => {
        const retRvResolve = (rv = getUndefinedValue()) => {
          if (!isInstanceOf(rv, RuntimeValue)) {
            throw new Error('resolve的值运行时错误')
          }
          if (state === PENDING) { 
            state = FULFILLED;
            
            res(rv)
          }
        }
        const retRvReject = (e) => {
          if (!isInstanceOf(e, RuntimeValue)) {
            throw new Error('reject的值运行时错误')
          }
          if (state === PENDING) {
            e = JSErrorToRuntimeValue(e);
            state = REJECTED
          
            rej(e)
          }
        }
        try {
          parseAst({
            "type": "CallExpression",
            "callee": createRuntimeValueAst(cbRv, 'PromiseConsturctorCallback'),
            "arguments": [
              createRuntimeValueAst(generateFn('res', ([argsRv]) => {
                retRvResolve(argsRv)
              }), 'resolve'),
              createRuntimeValueAst(generateFn('rej', ([eRv]) => {
                retRvReject(eRv)
              }), 'reject'),
            ],
            "optional": false
          }, env)
        } catch (e) {
          retRvReject(e)

        }
      })
      promise.then((rv) => {
        retRv.setPromiseState(createString(state))
        retRv.setPromiseResult(rv)
      }, (e) => {
        retRv.setPromiseState(createString(state))
        retRv.setPromiseResult(e)
      })
      const retRv = createPromiseInstanceRv({
        [RUNTIME_VALUE_DICTS.promiseInstance]: promise,
      })
      return retRv;
    });

    ['resolve', 'reject'].forEach(attr => {
      promiseRv.setWithDescriptor(attr, generateFn('Promise$' + attr, ([argsRv], { _this }) => {
        return createPromiseInstanceRv({
          [RUNTIME_VALUE_DICTS.promiseInstance]: Promise[attr](argsRv),
        })
      }))
    });


    const cb = ([thenRv, catchRv], { _this }) => {
      return getNewRuntimePromiseInstanceValue(_this, (resolve, reject) => {
        const getHandle = (fnRv, type, astMessage) => (argsRv) => {
          if (!isInstanceOf(fnRv, RuntimeValue)) {
            throw new Error(type + '接受值错误')
          }
          try {
            const tRv = (runFunctionRuntimeValueInGlobalThis(createRuntimeValueAst(fnRv, type + '_callback'), getWindowEnv(), createRuntimeValueAst(argsRv ?? getUndefinedValue(), astMessage)))
            if (isInstanceOf(tRv, RuntimePromiseInstanceValue)) {
              // 循环调用需要处理
              tRv.getPromiseInstance().then((resRv) => {
                resolve(resRv)
              })
            } else {
              resolve(tRv)
            }
          } catch (e) {
            reject(e)
          }
        }
        return [getHandle(isFunctionRuntimeValue(thenRv ?? getUndefinedValue()) ? thenRv : generateFn('xReturnx', ([rv]) => rv), 'then', 'res'), 
        getHandle(isFunctionRuntimeValue(catchRv ?? getUndefinedValue()) ? catchRv : generateFn('throw', ([rv] ) => {
          throw rv
        }), 'catch', 'e')]
      });
    };
    const promisePrototypeRv = createObject({
      then: generateFn('Promise$prototype$then', cb),
      catch: generateFn('Promise$prototype$catch', ([catchRv], ...rest) => {
        return cb([getUndefinedValue(), catchRv], ...rest)
      }),
      finally: generateFn('Promise$prototype$finally', ([callbackRv], { _this }) => {
        return getNewRuntimePromiseInstanceValue(_this, (resolve, reject) => {
          const getHandle = (handleFn) => (tRv) => {
            try {
              runFunctionRuntimeValueInGlobalThis(createRuntimeValueAst(callbackRv, 'finally_callback', getWindowEnv()))
              handleFn(tRv)
            } catch (e) {
              reject(e)
            }
          }
          return [resolve, reject].map(getHandle)
        });
      })
    })
    promiseRv.setProtoType(promisePrototypeRv);

    rootPrv = { promiseRv, promisePrototypeRv };
  }
  return rootPrv
}

export function getPromiseRv() {
  if (!rootPrv) {
    ensureHadPromise()
  }
  return rootPrv.promiseRv;
}

export function getPromisePrototypeRv() {
  if (!rootPrv) {
    ensureHadPromise()
  }
  return rootPrv.promisePrototypeRv;
}