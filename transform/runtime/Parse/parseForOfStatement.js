import parseAst from "..";
import { isInstanceOf } from "../../commonApi";
import Environment from "../Environment";
import AstConfig from "../Environment/Generator/AstConfig";
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
  const arrV = parseAst(right, env);
  // todo 先处理类数组类型
  if (!isGeneratorFunctionRuntimeValue(arrV.get(getJsSymbolIterator()))) {
    console.log(arrV);
    throw new Error('for of 语句必须实现 * Symbol[iterator]的方法');
  }
  const isInGenerator = env.isInGeneratorEnv()
  if (isInGenerator) {
    if (!isInstanceOf(_.get(right, AST_DICTS._config), AstConfig)) {
      right[AST_DICTS._config] = new AstConfig()
    }
  }

  const genInstanceRv = parseAst({
    [AST_DICTS._config]: right[AST_DICTS._config],
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
    throw new Error('运行时错误')
  }

  let stepRv = parseAst({
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

  // console.error(stepRv,);
  while (!parseRuntimeValue(stepRv.get('done'))) {
    const paramsEnv = createEnviroment('for of let/const statement body', env, {
      [ENV_DICTS.noNeedLookUpVar]: true
    }, createEmptyEnviromentExtraConfig({ ast }))
    const childEnv = createEnviroment('for of let/const statement body', paramsEnv, {
      isForOfEnv: true,
      [ENV_DICTS.isForEnv]: true,
      [ENV_DICTS.noNeedLookUpVar]: true
    }, createEmptyEnviromentExtraConfig({ ast }))

    setPattern(stepRv.get('value'), left, paramsEnv, {
      kind: left.kind,
      useSet: left.kind === 'var',
    });
    parseAst(body, childEnv);
    if (childEnv.hadBreak() || childEnv.canDirectlyReturn(body)) {
      break;
    }
    if (childEnv.hadContinue()) {
      childEnv.setContinueFlag(false)
    }
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
  }

  // if (left.type === 'VariableDeclaration' && ['const', 'let'].includes(left.kind)) {
  //     let index = 0;
  //     for(const value of arrV.value) {
  //       const paramsEnv = createEnviroment(
  //         'for of let/const statement',
  //         env,
  //         {},
  //         createEmptyEnviromentExtraConfig({ast})
  //       );
  //       const childEnv = createEnviroment('for of let/const statement body' + index++, paramsEnv, {
  //         isForOfEnv: true,
  //         [ENV_DICTS.isForEnv]: true,
  //         [ENV_DICTS.noNeedLookUpVar]: true
  //       }, createEmptyEnviromentExtraConfig({ast}))
  //       setPattern(value, left,  paramsEnv, {});
  //       parseAst(body, childEnv);
  //       if (childEnv.hadBreak()) {
  //         break;
  //       }
  //       if (childEnv.hadContinue()) {
  //         childEnv.setContinueFlag(false)
  //       }
  //     }

  // } else {
  //   let i = 0;
  //   for(const value of arrV.value) {
  //     const childEnv = createEnviroment('for of var/noVariableDeclaration statement body' + i, env, {
  //       isForOfEnv: true,
  //       [ENV_DICTS.isForEnv]: true,
  //       [ENV_DICTS.noNeedLookUpVar]: true
  //     }, createEmptyEnviromentExtraConfig({ast}))
  //     setPattern(value, left, childEnv, { useSet: true });
  //     parseAst(body, childEnv);
  //     if (childEnv.hadBreak()) {
  //       break;
  //     }
  //     if (childEnv.hadContinue()) {
  //       childEnv.setContinueFlag(false)
  //     }
  //   }
  // }
}