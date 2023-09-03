import { createObject, getGenerateFn, getUndefinedValue } from "../RuntimeValueInstance";

let arrayProtoTypeV;
export function getArrayProtoTypeV() {
  if (!arrayProtoTypeV) {
    const generateFn = getGenerateFn()
    arrayProtoTypeV = createObject({
      push: generateFn('Array$push', (argsRv, { _this })=> {
        _.forEach(argsRv, rv => {
          _this.setWithDescriptor(_this.value.length, rv)
        })
      }),
      pop: generateFn('Array$pop', (argsRv, { _this })=> {
        _this.setWithDescriptor(_this.value.length, getUndefinedValue())
        return this.value.pop();
      })
    })
  }
  return arrayProtoTypeV;
}