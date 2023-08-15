import _ from "lodash";
import RuntimeValue from "./RuntimeValue";
import { isInstanceOf } from "../../commonApi";
import { createObject, getFalseV, getTrueV, getUndefinedValue } from "./RuntimeValueInstance";
import { PROPERTY_DESCRIPTOR_DICTS, RUNTIME_LITERAL } from "../constant";

export default class PropertyDescriptor{
  constructor({
        kind,
        ...rest
  }) {
    if (!kind) {
      console.error('没有kind');
    }
  
    Reflect.defineProperty(this, 'kind', {
      value: kind,
      enumerable: false,
      writable: true,
    })

    Reflect.defineProperty(this, 'currentState', {
      value: kind,
      enumerable: false,
      writable: true,
    })

    _.forEach(rest, (v, k) => {
      this[k] = v
    })

  }

  setCurrentState(kind){
    this.currentState = kind;
  }

  isShouldTriggerSet() {
    return this.hasAttr(RUNTIME_LITERAL.set) && this.currentState === PROPERTY_DESCRIPTOR_DICTS.init
  }

  setRuntimeValue(kind, rv) {
    if (!isInstanceOf(rv, RuntimeValue)) {
      throw new Error('rv 必须是 runtimeValue')
    }
    this[kind] = rv;
  }

  isDefineType() {
    return [PROPERTY_DESCRIPTOR_DICTS.REFLECT_DEFINE_PROPERTY].includes(this.kind)
  }

  isHaveSetterOrGetter() {
    return this.hasAttr(RUNTIME_LITERAL.set) || this.hasAttr(RUNTIME_LITERAL.get)
  }

  isPropertyDescriptorUnWritable() {
   return this.hasAttr(PROPERTY_DESCRIPTOR_DICTS.writable)  && this.getAttr(PROPERTY_DESCRIPTOR_DICTS.writable) === getFalseV()
  }

  isPropertyDescriptorConfigurable() {
    return this.getAttr(PROPERTY_DESCRIPTOR_DICTS.configurable) === getTrueV()
   }

  hasAttr(attr) {
    return Reflect.has(this, attr);
  }

  getAttr(attr) {
    return this[attr] ?? getUndefinedValue();
  }

  deleteAttr(attr) {
    Reflect.deleteProperty(this, attr);
  }

  toRuntimeValue() {
    return createObject({...this})
  }
}