import _ from "lodash";
import parseAst from "..";
import { getWindowEnv } from "../Environment/getWindow";
import { AST_DICTS, RUNTIME_LITERAL } from "../constant";
import { initEnviroment } from "../Environment/initEnviroment";
import generateCode from "../Generate";
import { createLookUpUndefinedAst } from "../Environment/NativeRuntimeValue/undefined";
import { getPreDeclarationKey } from "./parsePreDeclaration";
import { isInstanceOf } from "../../commonApi";
import RuntimeValue from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { createRuntimeValueAst, ifErrorIsRuntimeValueWillParse, isFunctionRuntimeValue } from "../Environment/utils";
import { runFunctionRuntimeValueInGlobalThis } from "../Environment/RuntimeValueInstance";


export function getTotalDefineKeyList(astList) {
  if (!astList.length) {
    return []
  }
  const astStack = [...astList];
  const ast = astStack.pop()
  if (ast.type === 'BlockStatement') {
    return [ ...getBlockDefinedLetConstClassKeyList(ast), ...getTotalDefineKeyList(astStack)]
  }

  if (['ForOfStatement', 'ForInStatement', 'ForStatement'].includes(ast.type)) {
    return [ ...getBlockDefinedLetConstClassKeyList({
      type: 'BlockStatement',
      body: [
        ast.type === 'ForStatement' ? ast.init :  ast.left,
      ]
    }), ...getTotalDefineKeyList(astStack)]
  }

  return getTotalDefineKeyList(astStack);
}


export function getStatement(statements, env) {
  const fnS = []
  const varS = [];
  const letConstS = []
  const total = []
  const isNoNeedLookUpVarEnv = env.isNoNeedLookUpVarEnv()

  const lookUpVarFunctionBeUndefined = (c, config) => {
    if (isNoNeedLookUpVarEnv) {
      return;
    }
    if (c.type === 'VariableDeclaration' && c.kind === 'var') {
      varS.push({
        ..._.omit(c, AST_DICTS._config),
        type: AST_DICTS.PreDeclaration,
        declarations: _.map(c.declarations, item => {
          return {
            ...item,
            init: null
          }
        }),
        kind: 'var',
      })
    } else if (c.type === 'FunctionDeclaration') {
      if (c.id.type !== 'Identifier') {
        throw new Error('未处理的预提升')
      }
      const name = c.id.name;
      if (getTotalDefineKeyList(config.stack).includes(name)) {
        // console.log(getTotalDefineKeyList(config.stack))
        return;
      }
      varS.push({
        type: AST_DICTS.PreDeclaration,
        declarations: [{
          type: 'VariableDeclarator',
          id: c.id, // todo,
          init: null
        }],
        kind: 'var',
      })
    }
  }
  // 遍历for循环和if语句, switch里的block，找到var使其提升
  const lookUpVarFunctionInBlock = (ast, config) => {
    const mergeConfig = { ...config, stack: [...config.stack, ast] }
    if (ast.type === 'BlockStatement') {
      _.forEach(ast.body, t => lookUpVarFunctionInBlock(t, mergeConfig))
    } else if (ast.type === 'ForStatement') {
      lookUpVarFunctionBeUndefined(ast.init, mergeConfig)
      lookUpVarFunctionInBlock(ast.body, mergeConfig);
    } else if (['ForOfStatement', 'ForInStatement'].includes(ast.type)) {
      lookUpVarFunctionBeUndefined(ast.left, mergeConfig);
      lookUpVarFunctionInBlock(ast.body, mergeConfig);
    } else if (['WhileStatement', 'DoWhileStatement'].includes(ast.type)) {
      lookUpVarFunctionInBlock(ast.body, mergeConfig);
    } else if (ast.type === 'IfStatement') {
      lookUpVarFunctionInBlock(ast.consequent, mergeConfig)
      if (ast.alternate) {
        lookUpVarFunctionInBlock(ast.alternate, mergeConfig)
      }
    } else if (ast.type === 'SwitchStatement') {
      for (const c of ast.cases) {
        lookUpVarFunctionInBlock({
          type: 'BlockStatement',
          body: c.consequent,
        }, mergeConfig)
      }
    } else if (ast.type === 'TryStatement') {
      lookUpVarFunctionInBlock(ast.block, mergeConfig);
      if (ast.handler) {
        lookUpVarFunctionInBlock(ast.handler.body, mergeConfig);
      }
      if (ast.finalizer) {
        lookUpVarFunctionInBlock(ast.finalizer, mergeConfig);
      }
    }
    lookUpVarFunctionBeUndefined(ast, mergeConfig)
  }

  function prePlaceHolderLetOrConst(c) {
    if ([RUNTIME_LITERAL.let, RUNTIME_LITERAL.const].includes(c.kind)) {
      letConstS.push({
        type: AST_DICTS.PreDeclaration,
        declarations: _.map(c.declarations, item => {
          return {
            ...item,
            init: null,
          }
        }),
        kind: c.kind,
      })
    }
  }

  const runStatement = (statements) => {
    const blockAst = {
      type: 'BlockStatement',
      body: statements,
    };
    const config = {
      stack: [blockAst],
    };
    _.forEach(statements, c => {
      if (c.type === 'FunctionDeclaration') {
        lookUpVarFunctionBeUndefined(c, config)
        fnS.push(c)
      } else if (c.type === 'ClassDeclaration') {
        letConstS.push({
          type: AST_DICTS.PreDeclaration,
          declarations: [{
            type: 'VariableDeclarator',
            id: c.id, // todo,
            init: null
          }],
          kind: 'class',
        })
        total.push(c)
      } else {
        if (c.type === 'VariableDeclaration') {
          if (c.kind === 'var') {
            lookUpVarFunctionBeUndefined(c, config)
          } else if (['let', 'const'].includes(c.kind)) {
            prePlaceHolderLetOrConst(c)
          }
        } else {
          lookUpVarFunctionInBlock(c, config)
        }
        // 应该将 var a = xx 去掉var；
        total.push(c)
      }
    })
  }
  runStatement(statements);
  total.unshift(...varS, ...fnS, ...letConstS)

  // console.log(env.envId)
  // console.warn(generateCode({
  //   type: 'BlockStatement',
  //   body: total,
  // }))
  // console.error(_.cloneDeep(total))
  return total;
}

export function getBlockDefinedLetConstClassKeyList(blockAst) {
  if (blockAst.type !== 'BlockStatement') {
    throw new Error('ast 不是BlockStatement')
  }
  const keyList = []

   _.forEach(blockAst.body, c => {
    if (c.type === 'ClassDeclaration') {
      keyList.push(...getPreDeclarationKey({
        type: AST_DICTS.PreDeclaration,
        declarations: [{
          type: 'VariableDeclarator',
          id: c.id, // todo,
          init: null
        }],
        kind: 'class',
       })
      )
    } else if (c.type === 'VariableDeclaration' && ['let', 'const'].includes(c.kind)) {
      keyList.push(...getPreDeclarationKey({
        type: AST_DICTS.PreDeclaration,
        declarations: _.map(c.declarations, item => {
          return {
            ...item,
            init: null,
          }
        }),
        kind: c.kind,
       })
      )
    }
   })
  return keyList;
}

export default function parseProgram(ast) {
  const env = getWindowEnv()
  initEnviroment()
  // console.log(ast.body[0], 'parseBlockStatement');
  if (ast.body.length && _.startsWith(ast.body[0].directive, 'use ')) {
    const type = _.slice(ast.body[0].directive, 4).join('')
    if (_.size(type)) {
      env.setDirective(type);
    }
    // console.warn(type, env.isInGeneratorEnv(), env.canSleepAble())
  }
  const statements = getStatement(ast.body, env);
  try {
    for(const c of  statements) {
      parseAst(c, env)
    }
  } catch(e) {
    e = ifErrorIsRuntimeValueWillParse(e)
    throw e;
  }
}