import { createNumber, createString, getGenerateFn } from "../RuntimeValueInstance"

export function getDateRv() {
  const generateFn =  getGenerateFn()
  const dateRv = generateFn('Date', () => {
    // todo
    return createString(Date())
  })
  dateRv.setWithDescriptor('now', generateFn('Date$now', () => {
    return createNumber(Date.now())
  }))
  return dateRv
}