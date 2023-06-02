import Environment from "./runtime/Environment";

export default function writeJSON (obj, prefix, flag, set = new Set()) {
  if (set.has(obj._envId || obj)) {
    return []
  }
  set.add(obj._envId || obj);
  const ret = [];
  const prefixSpace = new Array(prefix)
    .fill(0)
    .map((v) => " ")
    .join("");

  for (const attr in obj) {
    const t = obj[attr];
    if (t instanceof Object) {
      let next =  t;
       if ( t instanceof Environment) {
        next = set.has(t.envId) ? { 
          _envName: t.name,
          had_Loop_envId: t.envId,
        } : t.toString(true)
       }
      const child = writeJSON(next, prefix + 2, flag, set);
      ret.push(
        prefixSpace +
        `${attr * 1 == attr ? "" : attr + ": "}` +
        `${Array.isArray(t) ? "[" : "{"}\n`
      );
      ret.push(...child.join(""));
      ret.push(prefixSpace + `${Array.isArray(t) ? "]," : "},"}\n`);
    } else {
      ret.push(prefixSpace + `${attr * 1 == attr ? "" : attr + ": "}` + (!flag ? t : (
        typeof t == 'string' ? `'${t}'` : t
      ))+ ",\n");
    }
  }
  // console.log(set)
  return ret;
}