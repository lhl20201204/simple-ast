import Environment from ".";
import { isInstanceOf } from "../../commonApi";

class ExtraConfig{
  constructor(config) {
    Object.assign(this, config)
  }
}

export default function createEnviroment(name, parent, config, extraConfig) {
  if (!isInstanceOf(extraConfig, ExtraConfig)) {
    throw new Error('额外配置漏传')
  }
  // 后续对配置进行统一初始化。
  const { envStackStore } = parent;
  // console.log(_.cloneDeep(extraConfig.ast))
  if (envStackStore.useCache(extraConfig.ast)) {
    return envStackStore.getCache()
  }
  const ret = new Environment(name, parent, config)
  // if (ret.isInGeneratorEnv()) {
  //   console.log('新建',  ret)
  // }
  return ret;
}

export function createEmptyEnviromentExtraConfig(config={}) {
  return new ExtraConfig({
    ast: {},
    ...(config ?? {})
  })
}