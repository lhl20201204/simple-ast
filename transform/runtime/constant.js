export const RUNTIME_LITERAL = {
  equal: '=',
  or: '||',
  and: '&&',
  optional: '?.',
  undefined: 'undefined',
  function: 'function',
  class: 'class',
  null: 'null',
  true: 'true',
  false: 'false',
  extends: 'extends',
  static: 'static',
  super: 'super',
  new: 'new',
  typeof: 'typeof',
  instanceof: 'instanceof',
  void: 'void',
  delete: 'delete',
  return: 'return',
  if: 'if',
  else: 'else',
  this: 'this',
  for: 'for',
  of: 'of',
  in: 'in',
  continue: 'continue',
  break: 'break',
  while: 'while',
  async: 'async',
  yield: 'yield',
  await: 'await',
  throw: 'throw',
  $__proto__: '__proto__',
  $prototype: 'prototype',
  var: 'var',
  let: 'let',
  const: 'const',
  set: 'set',
  get: 'get',
}

export const DEBUGGER_DICTS = {
  isOutputConsoleFlag: '$___isOutputConsole___',
  isRenderingHTMLFlag: '$___isRenderingHTML__',
  isStringTypeUseQuotationMarks: 'isStringTypeUseQuotationMarks',
  isTextMode: 'isTextMode',
  isHTMLMode: 'isHTMLMode',
  onlyShowEnvName: 'onlyShowEnvName',
  parseRuntimeValueDeepth: 'parseRuntimeValueDeepth',
  prefixSpaceCount: 'prefixSpaceCount',
  isRenderHTMLSourceCode: 'isRenderHTMLSourceCode',
  isInWrapFunction: 'isInWrapFunction',
  isInWrapClass: 'isInWrapClass',
  currentAttr: 'currentAttr',
}

export const AST_LITERAL = {
  undefined: 'undefined',
  function: 'function',
}

export const RUNTIME_VALUE_TYPE = {
  function: 'function',
  arrow_func: 'arrow function',
  class: 'class',
  object: 'object',
  array: 'Array',
  arguments: 'arguments',
  super: 'super',
  undefined: 'undefined',
  number: 'number', 
  string: 'string', 
  boolean: 'boolean',
  null: 'null',
}

export const OUTPUT_TYPE = {
  object: 'runtime_output_object',
  function: 'runtime_output_function',
  undefined: 'runtime_output_undefined',
  number: 'runtime_output_number', 
  string: 'runtime_output_string', 
  boolean: 'runtime_output_boolean',
}

export function JS_TO_RUNTIME_VALUE_TYPE(x) {
  switch(typeof x) {
    case 'object' : return RUNTIME_VALUE_TYPE.object
    case 'function' : return RUNTIME_VALUE_TYPE.function
    case 'undefined' : return RUNTIME_VALUE_TYPE.undefined
    case 'number' : return RUNTIME_VALUE_TYPE.number
    case 'string' : return RUNTIME_VALUE_TYPE.string
    case 'boolean' : return RUNTIME_VALUE_TYPE.boolean
  }
  console.error(typeof x);
  throw new Error('未处理的js TO runtimevalue转换')
}

export function RUNTIME_VALUE_TO_OUTPUT_TYPE(x) {
  switch(x) {
    case RUNTIME_VALUE_TYPE.object : 
    case RUNTIME_VALUE_TYPE.arguments : 
    case RUNTIME_VALUE_TYPE.array : 
    case RUNTIME_VALUE_TYPE.super:
    case RUNTIME_VALUE_TYPE.null : return OUTPUT_TYPE.object
    case RUNTIME_VALUE_TYPE.class :
    case RUNTIME_VALUE_TYPE.arrow_func :
    case RUNTIME_VALUE_TYPE.function : return OUTPUT_TYPE.function
    case RUNTIME_VALUE_TYPE.undefined : return OUTPUT_TYPE.undefined
    case RUNTIME_VALUE_TYPE.number : return OUTPUT_TYPE.number
    case RUNTIME_VALUE_TYPE.string : return OUTPUT_TYPE.string
    case RUNTIME_VALUE_TYPE.boolean : return OUTPUT_TYPE.boolean
  }
  console.error(x);
  throw new Error('未处理的runtimevalue to output转换')
}

export function getRuntimeValueCreateByClassName(rv) {
  const protoRv = rv.getProto()
  return protoRv.type === RUNTIME_VALUE_TYPE.null ? 'Object':  protoRv.get('constructor').getDefinedName()
}
