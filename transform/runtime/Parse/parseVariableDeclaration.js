import parseAst from "..";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";
import setPattern from "./setPattern";

export default function parseVariableDeclaration(ast, env) {
  const type = ast.kind
 _.forEach(ast.declarations, ({ id, init}) => {
    const value = init ? parseAst(init, env) : getUndefinedValue();
    setPattern(value, id, env, { kind: type, useSet: type === 'var'})
  });
}