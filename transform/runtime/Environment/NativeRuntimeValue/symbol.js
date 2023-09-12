import { PROPERTY_DESCRIPTOR_DICTS, RUNTIME_VALUE_DICTS, RUNTIME_VALUE_TYPE } from "../../constant";
import RuntimeValue from "../RuntimeValue";
import { createObject, createString, getFalseV, getGenerateFn } from "../RuntimeValueInstance";
import parseRuntimeValue from "../parseRuntimeValue";
import { createSimplePropertyDescriptor, createUnwritablePropertyDescriptor } from "../utils";

let symbolV;


let symbol$iteratorRv;

export function getSymbolIteratorRv() {
  if (!symbol$iteratorRv) {
    symbol$iteratorRv = createSymbol('@@symbol.iterator');
  }
  return symbol$iteratorRv;
}

export function getSymbolV() {
  if (!symbolV) {
    const generateFn = getGenerateFn()
    symbolV = generateFn('Symbol', ([strRv]) => {
      return createSymbol(parseRuntimeValue(strRv))
    })
    const symbolPrototypeRv = createObject({
      toString: generateFn('Symbol$toString', (argsList, { _this }) => {
        const symbolJSValue = parseRuntimeValue(_this);
        return createString(symbolJSValue.toString())
      })
    });
    symbolV.setProtoType(symbolPrototypeRv)
    symbolPrototypeRv.set('constructor', symbolV, createSimplePropertyDescriptor({
      value: symbolV,
      [PROPERTY_DESCRIPTOR_DICTS.writable]: getFalseV()
    }))
    const iteratorRv = getSymbolIteratorRv();
    symbolV.set("iterator", iteratorRv, createUnwritablePropertyDescriptor({
      value: iteratorRv
    }))
  }
  return symbolV;
}

export function createSymbol(str) {
  const ret = new RuntimeValue(RUNTIME_VALUE_TYPE.symbol, Symbol(str), {
    [RUNTIME_VALUE_DICTS.proto]: getSymbolV().getProtoType()
  })
  return ret;
}
