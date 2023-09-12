import parseAst from "..";
import { getLookUpUndefinedRv, isLookUpUndefinedRuntimeValue } from "../Environment/NativeRuntimeValue/undefined";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";
import setPattern from "./setPattern";

const lookUpUndefinedRuntimeValue = getLookUpUndefinedRv()
export default function parseVariableDeclaration(ast, env) {
  const type = ast.kind
  _.forEach(ast.declarations, ({ id, init }) => {
    const value = init ? parseAst(init, env) : getUndefinedValue();
    setPattern(value, id, env, {
      kind: type,
      useSet: type === 'var' && value !== lookUpUndefinedRuntimeValue
    })
  });
}