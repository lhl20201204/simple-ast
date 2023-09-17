import Environment from ".";

export default function createEnviroment(...args) {
  // 后续对配置进行统一初始化。
  return new Environment(...args)
}
