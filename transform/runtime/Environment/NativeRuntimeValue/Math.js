import { createNumber, createObject, getGenerateFn } from "../RuntimeValueInstance";

let mathRv = null;

export function getMathRv() {
  if (!mathRv) {
    const generateRn = getGenerateFn()
    mathRv = createObject({
      random: generateRn('Math$random', () => {
        return createNumber(Math.random())
      })
    })
  }
  return mathRv;
}