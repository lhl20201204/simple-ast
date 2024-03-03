export const debuggerConfig = {
   debugging: [],
}

export function setDebugging(bool) {
   debuggerConfig.debugging.push(bool)
}

export function resetDebugging() {
   debuggerConfig.debugging.pop()
}
export function getDebugging() {
   return _.last(debuggerConfig.debugging)
}