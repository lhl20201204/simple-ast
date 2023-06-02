import parseAst from "..";
import RuntimeValue from "../Environment/RuntimeValue";
import parseRuntimeValue from "../Environment/parseRuntimeValue";

export class ObjectLike{
  constructor(...args) {
    return new Object(...args);
  }
}

export default function parseObjectExpression(ast, env) {
   const obj = new ObjectLike();
   _.forEach(ast.properties, ({ key, value , computed }) => {
    let k = key.name;
     if (computed) {
       k = parseRuntimeValue(parseAst(key, env));
     }
     obj[k] = parseAst(value, env);
   })
   return new RuntimeValue('object', obj);
}