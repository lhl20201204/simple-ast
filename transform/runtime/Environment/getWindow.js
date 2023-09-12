import Environment from ".";

let windowEnv;
export function getWindowObjectRv() {
  if (!windowEnv) {
    windowEnv = getWindowEnv().getValue()
  }
  return windowEnv;
}

export function getWindowEnv() {
  return Environment.window;
}
