import getAst from "./getAst";
import checkLegal from "./checkLegal";

export default function transform(str) {
  const ast = getAst(str);
  if (!checkLegal(ast)) {
    return "no-legal-input";
  }

  return ast;
}
