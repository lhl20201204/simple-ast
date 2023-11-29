import parseAst from "../..";
import { isInstanceOf } from "../../../commonApi";
import { JSErrorToRuntimeValue, errorRuntimeValueToJS } from "../../Parse/parseThrowStatement";
import { RUNTIME_VALUE_DICTS } from "../../constant";
import createPromiseInstanceRv from "../Promise"
import RuntimeValue, { RuntimePromiseInstanceValue } from "../RuntimeValue";
import { createArray, createObject, createString, getGenerateFn, getUndefinedValue, runFunctionRuntimeValueInGlobalThis } from "../RuntimeValueInstance";
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
      // 创建finally ，wrap
      // console.warn(_this.getId())
      // const newPromise = new Promise((res, rej) => {
      //   promise.then(...cb((rv) => {
      //     res(rv)
      //   }, (e) => {
      //     e = JSErrorToRuntimeValue(e)
      //     rej(e)
      //   }))
      // })
      // newPromise.then((rv) => {
      //   retRv.setPromiseState(createString(FULFILLED))
      //   retRv.setPromiseResult(rv)
      // }, (e) => {
      //   retRv.setPromiseState(createString(REJECTED))
      //   retRv.setPromiseResult(e)
      // })
      // const retRv = createPromiseInstanceRv({
      //   [RUNTIME_VALUE_DICTS.PromiseInstance]: newPromise,
      // })
      return createPromiseInstanceRv({
        [RUNTIME_VALUE_DICTS.PromiseInstance]: new Promise((res, rej) => {
          promise.then(...cb((rv) => {
            res(rv)
          }, (e) => {
            e = JSErrorToRuntimeValue(e)
            rej(e)
          }))
        }),
      });
    }

    const promiseRv = generateFn('Promise', ([cbRv], { env }) => {
      let state = PENDING;
      let promiseResult = null;
      const promise = new Promise((res, rej) => {
        const retRvResolve = (rv = getUndefinedValue()) => {
          if (!isInstanceOf(rv, RuntimeValue)) {
            throw new Error('resolve的值运行时错误')
          }
          if (state === PENDING) {
            state = FULFILLED;
            if (isInstanceOf(rv, RuntimePromiseInstanceValue)) {
              rv.getPromiseInstance().then(rv => {
                promiseResult = rv;
                res(rv)
              })
            } else {
              promiseResult = rv;
              res(rv)
            }
          }
        }
        const retRvReject = (e) => {
          if (state === PENDING) {
            e = JSErrorToRuntimeValue(e);
            state = REJECTED
            promiseResult = e;
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

      // function mark(rv) {
      //   retRv.setPromiseState(createString(state))
      //   retRv.setPromiseResult(rv)
      // }
      // promise.then(mark, mark);

      // console.warn(promiseResult)
      const retRv = createPromiseInstanceRv({
        [RUNTIME_VALUE_DICTS.PromiseResult]: isInstanceOf(promiseResult, RuntimeValue) ? promiseResult : undefined,
        [RUNTIME_VALUE_DICTS.PromiseInstance]: promise,
        [RUNTIME_VALUE_DICTS.PromiseState]: state,
      })
      return retRv;
    });

    ['resolve', 'reject'].forEach(attr => {
      promiseRv.setWithDescriptor(attr, generateFn('Promise$' + attr, ([argsRv], { _this }) => {
        return attr === 'resolve' && isInstanceOf(argsRv, RuntimePromiseInstanceValue) ? argsRv : createPromiseInstanceRv({
          [RUNTIME_VALUE_DICTS.PromiseInstance]: (Promise[attr]( argsRv)),
        })
      }))
    });

    function checkIsArrayLike(promisListRv) {
      if (!_.isArray(promisListRv?.value)) {
        throw new Error("PRomise.all 需传递数组")
      }
    }

    promiseRv.setWithDescriptor('all', generateFn('Promise$all', ([promisListRv]) => {
      return createPromiseInstanceRv({
        [RUNTIME_VALUE_DICTS.PromiseInstance]: new Promise((res, rej) => {
          checkIsArrayLike(promisListRv)
          const promiseList = _.map(promisListRv.value, p => {
            if (!isInstanceOf(p, RuntimePromiseInstanceValue)) {
              console.warn(p, promisListRv)
              throw new Error('Promise.all错误')
            }
            return p.getPromiseInstance()
          })
          const arr = []
          let count = 0;
          const len = promiseList.length;
          if (len === 0) {
            res(createArray([]))
          }
          promiseList.forEach((p, i) => {
            p.then((d) => {
              arr[i] = d
              if (++count === len) {
                res(createArray(arr))
              }
            }, reason => rej(JSErrorToRuntimeValue(reason)))
          })
        }),
      })
    }))

    promiseRv.setWithDescriptor('allSettled', generateFn('Promise$allSettled', ([promisListRv]) => {
      return createPromiseInstanceRv({
        [RUNTIME_VALUE_DICTS.PromiseInstance]: new Promise((res) => {
          checkIsArrayLike(promisListRv)
          const promiseList = _.map(promisListRv.value, p => {
            if (!isInstanceOf(p, RuntimePromiseInstanceValue)) {
              throw new Error('Promise.all错误')
            }
            return p.getPromiseInstance()
          })
          const arr = []
          let count = 0;
          const len = promiseList.length;
          if (len === 0) {
            res(createArray([]))
          }

          const handle = (i, fn) => (value) => {
            arr[i] = fn(value)
            if (++count === len) {
              res(createArray(arr))
            }
          }
          promiseList.forEach((p, i) => p.then(handle(i, (value) => createObject({ status: createString('fulfilled'), value })),
            handle(i, (reason) => createObject({ status: createString('rejected'), reason: JSErrorToRuntimeValue(reason) }))))
        }),
      })
    }))

    promiseRv.setWithDescriptor('race', generateFn('Promise$race', ([promisListRv]) => {
      return createPromiseInstanceRv({
        [RUNTIME_VALUE_DICTS.PromiseInstance]: new Promise((res, rej) => {
          checkIsArrayLike(promisListRv)
          const promiseList = _.map(promisListRv.value, p => {
            if (!isInstanceOf(p, RuntimePromiseInstanceValue)) {
              throw new Error('Promise.race错误',)
            }
            return p.getPromiseInstance()
          })
          promiseList.forEach((p) => {
            p.then(res, reason => rej(JSErrorToRuntimeValue(reason)))
          })
        }),
      })
    }))


    const cb = ([thenRv, catchRv], { _this }) => {
      if (!isInstanceOf(_this, RuntimePromiseInstanceValue)) {
        throw new Error('Promise.then失败',)
      }

      const getHandle = (fnRv, type, astMessage) => (argsRv) => {
        if (!isInstanceOf(fnRv, RuntimeValue)) {
          throw new Error(type + '接受值错误')
        }

        if (type === 'catch') {
          argsRv = JSErrorToRuntimeValue(argsRv)
        }
        const tRv = (runFunctionRuntimeValueInGlobalThis(createRuntimeValueAst(fnRv, type + '_callback'), getWindowEnv(), createRuntimeValueAst(argsRv ?? getUndefinedValue(), astMessage)))
        return isInstanceOf(tRv, RuntimePromiseInstanceValue) ? tRv.getPromiseInstance() : tRv;
      }
      const promise = _this.getPromiseInstance()
      return createPromiseInstanceRv({
        [RUNTIME_VALUE_DICTS.PromiseInstance]: promise.then(getHandle(isFunctionRuntimeValue(thenRv ?? getUndefinedValue()) ? thenRv : generateFn('xReturnx', ([rv]) => rv), 'then', 'res'),
          getHandle(isFunctionRuntimeValue(catchRv ?? getUndefinedValue()) ? catchRv : generateFn('throw', ([rv]) => {
            throw rv
          }), 'catch', 'e'))
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
              runFunctionRuntimeValueInGlobalThis(createRuntimeValueAst(callbackRv, 'finally_callback'), getWindowEnv())
              handleFn(isInstanceOf(tRv, RuntimePromiseInstanceValue) ? tRv.getPromiseInstance() : tRv)
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