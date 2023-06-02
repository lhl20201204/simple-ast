import parseRuntimeValue from "./parseRuntimeValue";

export default class RuntimeValue{
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
} 

const nullV  = new RuntimeValue('null', null);
export function getNullValue() {
  return nullV;
}

const undefinedV = new RuntimeValue('undefined', undefined);
export function getUndefinedValue() {
  return undefinedV;
}

const consoleV = new RuntimeValue('object', {
  log: new RuntimeValue('function', {
    type: 'FunctionExpression',
    id: { name: 'console.log' },
    params: [
      {
        type: 'RestElement',
        argument: {
          type: 'Identifier',
          name: 'args',
        },
      },
    ],
    funCb: (args) => {
      const newArr = _.map(args, item => {
        return parseRuntimeValue(item);
      })
      // 直接结构就行了
      console.warn(...newArr);
    },
    body: [],
  })
});

export function getConsoleValue() {
  return consoleV;
}

const trueV = new RuntimeValue('boolean', true);

export function getTrueV() {
  return trueV;
}

const falseV = new RuntimeValue('boolean', false);

export function getFalseV() {
  return falseV;
}

const NULL = 'null';
const UNDEFINED = 'undefined';
const CONSOLE = 'console';
const TRUE = 'true';
const FALSE = 'false';
export function initConst() {
  return [
    [NULL, nullV],
    [UNDEFINED, undefinedV],
    [CONSOLE, consoleV],
    [TRUE, trueV],
    [FALSE, falseV],
  ]
}