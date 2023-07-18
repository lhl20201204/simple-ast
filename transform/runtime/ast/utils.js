import ASTItem from "./ASTITem";

export function valueToRaw(value) {
  const ret = []
  for(const x of value.split('')) {
    if (['\'', '\"', '\\'].includes(x)) {
      ret.push('\\', x)
    } else {
      ret.push(x)
    }
  }
  return ret;
}
