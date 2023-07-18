import _ from "lodash";
import parseAst from "..";
import RuntimeValue from "../Environment/RuntimeValue";
import Environment from "../Environment";
import { getAstCode } from "../Generate";
import { RUNTIME_LITERAL, RUNTIME_VALUE_TYPE } from "../constant";
import { createObject } from "../Environment";
import { createRuntimeValueAst, isObjectRuntimeValue, getBindRuntimeValue } from "../Environment/utils";

export default function parseNewExpression(ast, env) {
  // 开始创建类；
  const { callee, arguments: args } = ast;
  // 得到类
  const classRv = parseAst(callee, env);
  // 查找构造函数
  // console.log(classRv)


  // 先做class的
  if (classRv.type === RUNTIME_VALUE_TYPE.class) {
    const { 
      [RuntimeValue.symbolAst]: classAst,
      [RuntimeValue.symbolEnv]: classDefindedEnv, 
      [RuntimeValue.symbolMergeNewCtor]: classMergeCtorRv,
      [RuntimeValue.symbolName]: classDefindedName,
    } = classRv.value;
    const { id, superClass  } = classAst;
    // 先处理有构造函数的情况
  
    const objRv = createObject({})
    const ctorEnv = classMergeCtorRv.getDefinedEnv()
    const classNewEnv =  new Environment('new_class_' + (getAstCode(id, { text: true}) ?? '匿名类') + '_of_env',
      ctorEnv,
    )
    // console.log('合并的ctor', classMergeCtorRv);
    // console.log('new 的时候创建的环境',  classNewEnv.getEnvPath());
  
    classNewEnv.addConst(RUNTIME_LITERAL.this, objRv);
    objRv.setProto(classRv.getProtoType())
    // classNewEnv.addConst('callee', createFunction({
    //   [RuntimeValue.symbolAst]: ctorAst,
    //   [RuntimeValue.symbolEnv]: classNewEnv,
    //   [RuntimeValue.symbolName]:  getAstCode(id, { text: true }),
    // }))
    // if (superClass) {
    //   const superClassRv = parseAst(superClass, classDefindedEnv);
    //   classNewEnv.addConst(RUNTIME_LITERAL.super, superClassRv);
    //   console.log('添加super的环境的id', classNewEnv.envId)
    // }
    // _.forEach(_.filter(classBodyAst.body, c => !c.static && c.type === 'PropertyDefinition'), handleProperty(objRv, classDefindedMap, classNewEnv))
    const ctorName = classMergeCtorRv.getDefinedName();
    const CtorRv = getBindRuntimeValue(classNewEnv, createRuntimeValueAst(classMergeCtorRv, ctorName));
    const retRv = parseAst({
      type: 'CallExpression',
      callee: createRuntimeValueAst(
        CtorRv,
        `(_ref/* =${ctorName}.bind(this) */)`
      ),
      arguments: args,
      optional: false,
    }, classNewEnv)
    
    // todo 判断其是否是引用对象
    if (isObjectRuntimeValue(retRv)) {
      return retRv;
    }
    return objRv;
  } 
  else if ([RUNTIME_VALUE_TYPE.function].includes(classRv.type)) {
    const objRv = createObject({})
    const ctorEnv = classRv.getDefinedEnv()
    const ctorName = classRv.getDefinedName();
    const classNewEnv =  new Environment('new_function_' + (ctorName) + '_of_env',
    ctorEnv,
  )

    const CtorRv = getBindRuntimeValue(classNewEnv, createRuntimeValueAst(classRv, ctorName));
    classNewEnv.addConst(RUNTIME_LITERAL.this, objRv);
    objRv.setProto(createObject({
      constructor: classRv,
    }))
    const retRv = parseAst({
      type: 'CallExpression',
      callee: createRuntimeValueAst(
        CtorRv,
        `(_ref/* =${ctorName}.bind(this) */)`
      ),
      arguments: args,
      optional: false,
    }, classNewEnv)
     
   
    // todo 判断其是否是引用对象
    if (isObjectRuntimeValue(retRv)) {
      return retRv;
    }
    return objRv;
  }
  
  throw new Error('不是构造函数');
}