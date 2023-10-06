import parseAst from "..";
import { setDebugging } from "../../../debugger";
import { isInstanceOf } from "../../commonApi";
import Environment from "../Environment";
import AstConfig, { clearAstConfig } from "../Environment/Generator/AstConfig";
import { getJsSymbolIterator, getSymbolIteratorRv } from "../Environment/NativeRuntimeValue/symbol";
import { RuntimeGeneratorInstanceValue } from "../Environment/RuntimeValue";
import createEnviroment, { createEmptyEnviromentExtraConfig } from "../Environment/createEnviroment";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { createRuntimeValueAst, isGeneratorFunctionRuntimeValue } from "../Environment/utils";
import generateCode from "../Generate";
import { AST_DICTS, ENV_DICTS, RUNTIME_VALUE_TYPE } from "../constant";
import setPattern from "./setPattern";

export default function parseForOfStatement(ast, env) {
  const { left, right, body } = ast;
  const iteratorableRv = parseAst(right, env);
  // todo 先处理类数组类型
  if (
    !isInstanceOf(iteratorableRv, RuntimeGeneratorInstanceValue) &&
    !isGeneratorFunctionRuntimeValue(iteratorableRv.get(getJsSymbolIterator()))) {
    throw new Error(`for of 语句的遍历对象必须是生成器实例，
    或者实现 * Symbol[iterator]间接得到生成器实例的方法`);
  }
  const isInGenerator = env.isInGeneratorEnv()
  if (isInGenerator) {
    if (!isInstanceOf(_.get(right, AST_DICTS._config), AstConfig)) {
      right[AST_DICTS._config] = new AstConfig()
    }
  }

  const rightAstConfig = isInstanceOf(right[AST_DICTS._config], AstConfig) ?
    right[AST_DICTS._config].getGeneratorAstConfig() : right[AST_DICTS._config];

  const genInstanceRv = parseAst({
    [AST_DICTS._config]: rightAstConfig,
    "type": "ExpressionStatement",
    "expression": {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "object": right,
        "property": createRuntimeValueAst(
          getSymbolIteratorRv(),
          'Symbol$iterator'
        ),
        "computed": true,
        "optional": false
      },
      "arguments": [],
      "optional": false
    },
  },
    env,
  )
  if (!isInstanceOf(genInstanceRv, RuntimeGeneratorInstanceValue)) {
    throw new Error('非generator实例运行时错误')
  }

  let stepRv = null;
  const setStepRv = () => {
    stepRv = parseAst({
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "object": createRuntimeValueAst(genInstanceRv, '_gen'),
        "property": {
          "type": "Identifier",
          "name": "next"
        },
        "computed": false,
        "optional": false
      },
      "arguments": [
      ],
      "optional": false
    }, env)
    return stepRv;
  };
  const getStepRv = () => stepRv;
  if (isInstanceOf(rightAstConfig, AstConfig)) {
    if (_.isNil(rightAstConfig.getIteratorRuntimeValue())) {
      rightAstConfig.setIteratorRuntimeValue(setStepRv())
    }
    stepRv = rightAstConfig.getIteratorRuntimeValue();
  } else {
    setStepRv()
  }

  while (!parseRuntimeValue(getStepRv().get('done'))) {
    const paramsEnv = createEnviroment('for_of_statement_params', env, {
      [ENV_DICTS.noNeedLookUpVar]: true
    }, createEmptyEnviromentExtraConfig({ ast }))
    if (isInGenerator) {
      paramsEnv.pushEnvStack()
    }
    const childEnv = createEnviroment('for_of_statement_body', paramsEnv, {
      isForOfEnv: true,
      [ENV_DICTS.isForEnv]: true,
      [ENV_DICTS.noNeedLookUpVar]: true
    }, createEmptyEnviromentExtraConfig({ ast }))

    setPattern(getStepRv().get('value'), left, paramsEnv, {
      kind: left.kind,
      useSet: left.kind === 'var',
      allowConstLetDefineAgain: paramsEnv.isCacheFromParentEnv(),
    });
    parseAst(body, childEnv);
    if (isInGenerator) {
      paramsEnv.popEnvStack()
    }
    if (childEnv.hadBreak() || childEnv.canDirectlyReturn(body)) {
      break;
    }
    if (childEnv.hadContinue()) {
      childEnv.setContinueFlag(false)
    }
    setStepRv()
    if (isInGenerator) {
      rightAstConfig.setIteratorRuntimeValue(getStepRv())
      clearAstConfig(body);
    }
  }
}