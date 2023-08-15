import writeJSON, { textReplace } from "../../util";
import { DEBUGGER_DICTS } from "../constant";

export default function parseDebuggerStatement(ast, env) {
  // requestAnimationFrame(() => {
    const node = document.getElementById('debuggerScene');
    node.style.opacity = 1;
    const content = document.getElementById('debuggerText');
    const newEnvJSON = env.toWrite(false, true);
    
    requestAnimationFrame(() => {
      const text = textReplace("{\n" + writeJSON(newEnvJSON, 2, {
        [DEBUGGER_DICTS.isDebuggering]: true,
        [DEBUGGER_DICTS.isStringTypeUseQuotationMarks]: true, 
        [DEBUGGER_DICTS.isHTMLMode]: true, 
        [DEBUGGER_DICTS.onlyShowEnvName]: false}).join("") + "}");
      content.innerHTML = text;
    })
}