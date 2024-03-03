import _ from "lodash";
import parseAst from "..";
import RuntimeValue from "../Environment/RuntimeValue";
import Environment from "../Environment";
import generateCode, { getAstCode } from "../Generate";
import { RUNTIME_LITERAL, RUNTIME_VALUE_DICTS, RUNTIME_VALUE_TYPE } from "../constant";
import { createRuntimeValueAst, isObjectRuntimeValue, getBindRuntimeValue } from "../Environment/utils";
import { createObject } from "../Environment/RuntimeValueInstance";
import createEnviroment, { createEmptyEnviromentExtraConfig } from "../Environment/createEnviroment";

export default function parseNewExpression(ast, env) {
  // 开始创建类；
  const { callee, arguments: args } = ast;
  // 得到类
  const classRv = parseAst(callee, env);
  if ([RUNTIME_VALUE_TYPE.function, RUNTIME_VALUE_TYPE.class].includes(classRv.type)) {
    const objRv = createObject({})
    const ctorName = classRv.getDefinedName();
    const classNewEnv = createEnviroment(
      'new_function_' + (ctorName) + '_of_env',
      env,
      {},
      createEmptyEnviromentExtraConfig({ ast })
    )
    classNewEnv.addConst(RUNTIME_LITERAL.this, objRv);
    const CtorRv = getBindRuntimeValue(classNewEnv, createRuntimeValueAst(classRv, ctorName));
    objRv.setProto(classRv.getProtoType())

    const retRv = parseAst({
      type: 'CallExpression',
      callee: createRuntimeValueAst(
        CtorRv,
        `(_ref/* =${ctorName}.bind(this) */)`
      ),
      arguments: args.map((x, i) => {
        return createRuntimeValueAst(
          parseAst(x, env),
          generateCode(x),
        ) 
      }),
      optional: false,
    }, classNewEnv) // 就是这一步出问题了。



    // todo 判断其是否是引用对象
    if (isObjectRuntimeValue(retRv)) {
      return retRv;
    }
    // console.log(objRv, '---->')
    return objRv;
  }

  throw new Error('不是构造函数');
}