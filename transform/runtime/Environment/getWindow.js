import Environment from ".";

let windowEnv;
export function getWindowObject() {
  if (!windowEnv) {
    windowEnv = getWindowEnv().getValue()
  }
  return windowEnv;
}

export function getWindowEnv() {
  return Environment.window;
}
