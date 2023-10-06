export const debuggerConfig = {
   debugging: false,
}

export function setDebugging(bool) {
   debuggerConfig.debugging = bool
}

export function getDebugging() {
   return debuggerConfig.debugging
}