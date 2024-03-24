import parseAst from "..";
import { setDebugging } from "../../../debugger";
import { isInstanceOf } from "../../commonApi";
import AstConfig, { ensureAstHadConfig } from "../Environment/Generator/AstConfig";
import RuntimeValue from "../Environment/RuntimeValue";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";
import { AST_DICTS, GENERATOR_DICTS, RUNTIME_LITERAL } from "../constant";

export function isYieldError(e) {
  return isInstanceOf(e[GENERATOR_DICTS.yieldInnerRuntimeValue], RuntimeValue)
}

export function getYieldValue(e) {
  return e[GENERATOR_DICTS.yieldInnerRuntimeValue];
}

export function setYieldValue(e, rv) {
  e[GENERATOR_DICTS.yieldInnerRuntimeValue] =  rv;
}

export function getYieldEnv(e) {
  return e[GENERATOR_DICTS.yieldInnerEnv];
}

export function setYieldEnv(e, env) {
  e[GENERATOR_DICTS.yieldInnerEnv] = env;
}

export function innerParseYieldExpression(ast, env) {
  if (ast.delegate) {
    ensureAstHadConfig(ast.argument);
    const argumentAstConfig = _.get(ast.argument, AST_DICTS._config)
    const forOfRightAstConfig = argumentAstConfig.getYieldStarToForOfRightAstConfig();
    const forOfBodyAstConfig = argumentAstConfig.getYieldStarToForOfBodyAstConfig();
    const forOfYieldAstCofig = argumentAstConfig.getYieldStarToForOfYieldAstConfig()
    parseAst({
      [AST_DICTS._config]: argumentAstConfig,
      "type": "ForOfStatement",
      "await": false,
      "left": {
        "type": "VariableDeclaration",
        "declarations": [
          {
            "type": "VariableDeclarator",
            "id": {
              "type": "Identifier",
              "name": "inner"
            },
            "init": null
          }
        ],
        "kind": "const"
      },
      "right": { 
        ..._.cloneDeep(ast.argument),
        [AST_DICTS._config]: forOfRightAstConfig,
      },
      "body": {
        [AST_DICTS._config]: forOfBodyAstConfig,
        "type": "BlockStatement",
        "body": [
          {
            "type": "ExpressionStatement",
            "expression": {
              [AST_DICTS._config]: forOfYieldAstCofig,
              "type": "YieldExpression",
              "delegate": false,
              "argument": {
                "type": "Identifier",
                "name": "inner"
              },
            }
          }
        ],
      }
    }, env)
    return getUndefinedValue()
  } else {
    const yieldRv = ast.argument ? parseAst(ast.argument, env) : getUndefinedValue();
    const astConfig = _.get(ast, AST_DICTS._config);
    if (astConfig.getNeedReceiveNextValue()) {
      const ret = env.getNextValue()
      return ret;
    }
    // yield 关键字底层用Error抛出处理；
    const e = new Error('yield 中断停止');
    // 设置唯一标志符
    setYieldValue(e, yieldRv);
    setYieldEnv(e, env);
    // console.error('yield值', yieldRv, e.getYieldRuntimeValue());
    astConfig.setNeedReceiveNextValue(true);
    throw e;
  }
}

export default function parseYieldExpression(ast, env) {
  if (!env.isInGeneratorEnv()) {
    throw new Error('当前不在生成器函数定义范围内无法' + RUNTIME_LITERAL.yield)
  }
  return innerParseYieldExpression(ast, env);
}