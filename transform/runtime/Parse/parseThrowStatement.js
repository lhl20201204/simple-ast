import parseAst from "..";
import { isInstanceOf } from "../../commonApi";
import Environment from "../Environment";
import RuntimeValue from "../Environment/RuntimeValue";
import { getUndefinedValue } from "../Environment/RuntimeValueInstance";
import { getWindowEnv, getWindowObjectRv } from "../Environment/getWindow";
import parseRuntimeValue from "../Environment/parseRuntimeValue";
import { createLiteralAst, instanceOfRuntimeValue } from "../Environment/utils";

export function JSErrorToRuntimeValue(err) {
  if (isInstanceOf(err, RuntimeValue)) {
    return err;
  }
  if (isInstanceOf(err, Error)) {
    // todo跟踪yield *
    return parseAst({
      "type": "NewExpression",
      "callee": {
        "type": "Identifier",
        "name": "Error"
      },
      "arguments": [
        createLiteralAst(err.message)
      ]
    }, getWindowEnv())
  }

  if (_.isUndefined(err)) {
    return getUndefinedValue()
  }

  throw new Error('未处理的error运行时错误')
}

export default function parseThrowStatement(ast, env) {
  const rv = parseAst(ast.argument, env);
  // console.error('抛出', rv);
  throw rv;
}