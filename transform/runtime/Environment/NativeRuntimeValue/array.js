import { createArray, createObject, getGenerateFn, getUndefinedValue } from "../RuntimeValueInstance";
import parseRuntimeValue from "../parseRuntimeValue";
import { getSymbolIteratorRv } from "./symbol";

let arrayProtoTypeV;

let arrayRv;
export function getArrayProtoTypeV() {
  if (!arrayProtoTypeV) {
    const generateFn = getGenerateFn()
    // console.log('即将生成--->')
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
        _this.resetAllValuePropertyDescriptor()
      }),
      shift: generateFn('Array$shift', (argsRv, { _this })=> {
         const t = _this.value.shift()
         _this.resetAllValuePropertyDescriptor()
         return t;
      }),
    })
    // console.log(_.cloneDeep('初始化的时候length'), arrayProtoTypeV.getPropertyDescriptor('length'), _.cloneDeep(arrayProtoTypeV))
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