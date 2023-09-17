import { createArray, createObject, getGenerateFn, getUndefinedValue } from "../RuntimeValueInstance";
import parseRuntimeValue from "../parseRuntimeValue";
import { getSymbolIteratorRv } from "./symbol";

let arrayProtoTypeV;

let arrayRv;
export function getArrayProtoTypeV() {
  if (!arrayProtoTypeV) {
    const generateFn = getGenerateFn()
    arrayProtoTypeV = createObject({
      push: generateFn('Array$push', (argsRv, { _this })=> {
        _.forEach(argsRv, rv => {
          _this.setWithDescriptor(_this.value.length, rv)
          _this.value.push(rv);
        })
      }),
      pop: generateFn('Array$pop', (argsRv, { _this })=> {
        _this.setWithDescriptor(_this.value.length, getUndefinedValue())
        return this.value.pop();
      }),
      unshift: generateFn('Array$unshift', (argsRv, { _this })=> {
        _.forEach(argsRv, rv => {
          _this.value.unshift(rv);
        })
        _.forEach(_this.value, (v, i) => {
          _this.setWithDescriptor(i, v)
        }) 
      }),
      shift: generateFn('Array$shift', (argsRv, { _this })=> {
         const t = _this.value.shift()
         _.forEach(_this.value, (v, i) => {
          _this.setWithDescriptor(i, v)
        }) 
         return t;
      }),
      [parseRuntimeValue(getSymbolIteratorRv())]: generateFn('Array$Symbol$iterator', (argsRv, { _this}) => {
         //  let i = 0;
         // while(i < _this.length) {
         //   yield _this[i++]
         // }
         // todo
         return getUndefinedValue()
      }, {
        generator: true,
      })
    })
  }
  return arrayProtoTypeV;
}

export function getArrayRv() {
  if (!arrayRv) {
     const generateFn = getGenerateFn()
     arrayRv = generateFn('Array', ([rv]) => {
      let temp = rv.value;
      if (_.isNumber(temp)) {
        temp = new Array(temp).fill(getUndefinedValue())
      }
      return createArray(temp);
     })
     arrayRv.setProtoType(getArrayProtoTypeV())
  }
  return arrayRv;
}