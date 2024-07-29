export function isInstanceOf(left, right) {
  return left instanceof right;
}

export function isInRoot(node) {
  let t = node;
  while (t && t.id !== 0) {
    t = t.parentNode;
  }
  // 0 为仿照的document.body;
  return !!t && t.id === 0;
}

const nextTickCallbackList = [];

export function nextTick(cb) {
  nextTickCallbackList.push(cb);
}

export function runNextTickCallbackList() {
  nextTickCallbackList.forEach(cb => cb());
  nextTickCallbackList.splice(0, nextTickCallbackList.length)
}

