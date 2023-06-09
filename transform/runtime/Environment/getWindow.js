import Environment from ".";

export function getWindowObject() {
  return Environment.window.getValue();
}

export function getWindowEnv() {
  return Environment.window;
}
