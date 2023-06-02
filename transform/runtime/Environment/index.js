import { getConsoleValue, getNullValue, getUndefinedValue, initConst } from "./RuntimeValue";
import parseRuntimeValue from "./parseRuntimeValue";
const KEY_VALUEMAP = initConst();
const skipField = new Set(_.map(KEY_VALUEMAP, '0'));
let id = 0;
export default class Environment {
  constructor(name, parent) {
    this.envId = 'symbol(' + id ++ + ')';
    this.name = name;
    this.parent = parent ?? null;
    if (parent) {
      this.parent.addChildren(this);
    }
    this.children = [];
    this.map = new Map()
    this.keyMap = new Map();
    this.constMap = new Map();
  }

  addChildren(env) {
    this.children.push(env);
  }

  addConst(key, value) {
    if (this.keyMap.has(key)) {
      throw new Error(`${key} 已被定义`);
    }
    this.constMap.set(key, value);
    this.keyMap.set(key, 'const');
  }

  addVar(key, value) {
    if (this.keyMap.has(key) && !['var', 'function'].includes(this.keyMap.get(key))) {
      throw new Error(`${key} 已被定义`);
    } 
    this.map.set(key, value);
    this.keyMap.set(key, 'var');
  }

  addLet(key, value) {
    if (this.keyMap.has(key)) {
      throw new Error(`${key} 已经定义`);
    }
    this.map.set(key, value);
    this.keyMap.set(key, 'let')
  }

  addFunction(key, value) {
    this.map.set(key, value);
    this.keyMap.set(key, 'function')
  }

  get(key) {
    if (this.keyMap.has(key)) {
      return this.map.get(key) || this.constMap.get(key)
    } 

    if (! this.parent) {
      throw new Error(`${key} 为 undefined`)
    }
    return this.parent.get(key)
  }

  set(key, value) {
    if (this.keyMap.has(key)) {
      if (this.map.has(key)) {
        this.map.set(key, value)
      } else if (this.constMap.has(key)) {
        throw new Error(`const ${key} 不能被重新定义`);
      }
    } 
    if (!this.parent) {
      throw new Error(`${key} 为 undefined`)
    }

    this.parent.set(key, value)
  }

  reset() {
    this.parent = null;
    this.children = [];
    this.map = new Map()
    this.keyMap = new Map()
    this.constMap = new Map();
    _.forEach(KEY_VALUEMAP, ([key, value]) => {
      this.addConst(key, value)
    })
  }

  toString(noGetChildren) {
    const obj = { _envName: this.name, _envId: this.envId }
    _.forEach([...this.keyMap], ([key]) => {
      if (skipField.has(key)) {
        return;
      }
      const rv = this.constMap.get(key) || this.map.get(key)
      obj[key] = parseRuntimeValue(rv);
    })
    if (!noGetChildren && _.size(this.children)) {
      obj.children = _.map(this.children, c => c.toString())
    }
    return obj;
  }
}