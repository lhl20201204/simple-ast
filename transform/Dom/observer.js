import { Reaction, runInAction } from "./Reaction";
const weakMap = new WeakMap();

const runWeakMap = new WeakMap();

export const totalReactionList = []

function createReaction(callback, debuggerKey) {
  if (!weakMap.has(callback)) {
    const reaction = new Reaction(callback, debuggerKey);
    totalReactionList.push(reaction);
    weakMap.set(callback, reaction)
  }
  return weakMap.get(callback);
}

export function observer(cb, callback, debuggerKey) {
  const reaction = createReaction(callback, debuggerKey);
  Reaction.push(reaction)
  runInAction(cb, true);
  Reaction.pop()
  return reaction.disposer;
}

export function autorun(run, debuggerKey) {
  const callback = () => {
    observer(run, callback, debuggerKey);
  } ;
  return observer(run, callback, debuggerKey);
}