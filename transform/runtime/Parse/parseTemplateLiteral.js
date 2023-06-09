import parseAst from "..";
import RuntimeValue from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";

export default function parseTemplateLiteral(ast, env) {
  const { quasis, expressions } = ast;
  const qq = [...quasis];
  const ex = [...expressions];
  let ret = '';
  while(qq.length) {
    ret+= parseRuntimeValue(parseAst(qq.shift(), env))
    if (ex.length) {
      ret+= parseRuntimeValue(parseAst(ex.shift(), env))
    }
  }
  if (qq.length || ex.length) {
    throw new Error('模版字符串解析错误')
  }
  return new RuntimeValue('string', ret);
}