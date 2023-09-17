import Environment from "..";
import parseAst from "../..";
import { ENV_DICTS, GENERATOR_DICTS, RUNTIME_LITERAL, RUNTIME_VALUE_DICTS } from "../../constant";
import { getUndefinedValue } from "../RuntimeValueInstance";
import createEnviroment from "../createEnviroment";
import { createRuntimeValueAst } from "../utils";

let gid = 0;
export default class GeneratorConfig {
  constructor(x) {
    Reflect.defineProperty(this, GENERATOR_DICTS.isGeneratorConfig, {
      value: true,
      configurable: false,
      writable: false,
      enumerable: false,
    })
    this.id = gid++;
    this.mounted = false;
    this.ast = x.ast;
    this.done = false;
    this.fnRv = x.fnRv;
    this.defineEnv = x.defineEnv;
    this.fnRv.setDefinedEnv(this.defineEnv);
    // this.fnRv.value[RUNTIME_VALUE_DICTS.symbolEnv] = this.defineEnv;
    this.contextEnv = x.contextEnv;
    this.runEnv = null;
    // this.contextEnv.setCurrentIsGeneratorFunctionEnv(true)
    this.contextThis = x.contextThis;
    this.contextArguments = x.contextArguments
    this.contextNextValue = getUndefinedValue()
    this.runtimeStack = [];
  }
  
  isGeneratorConfig() {
    return this[GENERATOR_DICTS.isGeneratorConfig];
  }

  hadMounted() {
    return this.mounted;
  }

  setNextValue(rv) {
    this.contextNextValue = rv;
  }

  getNextValue() {
    return this.contextNextValue;
  }

  runGeneratorFunction() {
    let mounted = false;
    if (!this.runEnv) {
      this.runEnv = createEnviroment('generator_of_' + this.fnRv.getDefinedName() + '_env', this.contextEnv, {
        [ENV_DICTS.isGeneratorFunction]: true,
        [ENV_DICTS.runningGenerateConfig]: this,
      })
      mounted = true;
    }
    try{
      const value =  parseAst(this.ast.body, this.runEnv);
      this.done = true;
      return value;
    } finally{
      if (mounted) {
        this.mounted = true;
      }
    }
  }
}