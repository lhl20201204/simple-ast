export const TOKEN_TYPE = {
  Split: '  Split',
  WrapLine: '\n WrapLine',
  Point: '. Point',
  StrictEqual: '=== StrictEqual',
  NoStrictEqual: '!== NoStrictEqual',
  Compare: '== Compare',
  NoCompare: '!= NoCompare',
  And: '&& And',
  OR: '|| OR',
  Mul: '* Mul',
  Div: '/ Div',
  Plus: '+ Plus',
  Subtract: '- Subtract',
  Word: 'Word',
  String: 'String',
  Number: 'Number',
  Optional: '?. Optional',
  OptionalCall: '?.( OptionalCall',
  OptionalComputedGet: '?.[ OptionalComputedGet',
  DoubleQuestion: '?? DoubleQuestion',
  SingleOr: '| SingleOr',
  SingleXor: '^ SingleXor',
  SingelAnd: '& SingelAnd',
  EOF: 'EOF',
  Question: '? Question',
  Colon: ': Colon',
  LeftParenthesis: '( LeftParenthesis',
  RightParenthesis: ') RightParenthesis',
  LeftBracket: '[ LeftBracket',
  RightBracket: '] RightBracket',
  LeftBrace: '{ LeftBrace',
  RightBrace: '} RightBrace',
  Comma: ', Comma',
  Semicolon: '; Semicolon',
  Equal: '= Equal',
  Star: '* Star',
  PlusEqual: '+= PlusEqual',
  SubEqual: '-= SubEqual',
  MulEqual: '*= MulEqual',
  DivEqual: '/= DivEqual',
  ModEqual: '%= ModEqual',
  ShiftLeftEqual: '<<= ShiftLeftEqual',
  ShiftRightEqual: '>>= ShiftRightEqual',
  UnsignedShiftRightEqual: '>>>= UnsignedShiftRightEqual',
  SingleAndEqual: '&= SingleAndEqual',
  SingleOrEqual: '|= SingleOrEqual',
  Non: '~ Non',
  Exclamation: '! Exclamation',
  Mod: '% Mod',
  SelfAdd: '++ SelfAdd',
  SelfSub: '-- SelfSub',
  DoubleStar: '** DoubleStar',
  UnsignedShiftRight: '>>> UnsignedShiftRight',
  ShiftRight: '>> ShiftRight',
  ShiftLeft: '<< ShiftLeft',
  XorEqual: '^= XorEqual',
  Less: '< Less',
  LessEqual: '<= LessEqual',
  Great: '> Great',
  GreatEqual: '>= GreatEqual',
  Spread: '... Spread',

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
  var: 'var',
  let: 'let',
  const: 'const',
  set: 'set',
  get: 'get',
  debugger: 'debugger',
  constructor: 'constructor',
  switch: 'switch',
  case: 'case',
  default: 'default',
  try: 'try',
  catch: 'catch',
  finally: 'finally',
  arguments: 'arguments',
  sleep: 'sleep',
  NaN: 'NaN',
  do: 'do',
}

export const EOFFlag = 'EOF';

export const AST_TYPE = {
  Program: 'Program',
  SequenceExpression: 'SequenceExpression',
  SpreadElement: 'SpreadElement',
  YieldExpression: 'YieldExpression',
  AssignmentExpression: 'AssignmentExpression',
  ConditionalExpression: 'ConditionalExpression',
  UnaryExpression: 'UnaryExpression',
  UpdateExpression: 'UpdateExpression',
  AwaitExpression: 'AwaitExpression',
  Literal: 'Literal',
  Identifier: 'Identifier',
  MemberExpression: 'MemberExpression',
  NewExpression: 'NewExpression',
  ArrayExpression: 'ArrayExpression',
  ObjectExpression: 'ObjectExpression',
  BinaryExpression: 'BinaryExpression',
  LogicalExpression: 'LogicalExpression',
  VariableDeclaration: 'VariableDeclaration',
  VariableDeclarator: 'VariableDeclarator',
  CallExpression: 'CallExpression',
  ExpressionStatement: 'ExpressionStatement',
  EmptyStatement: 'EmptyStatement',
  ThisExpression: 'ThisExpression',
  IfStatement: 'IfStatement',
  BlockStatement: 'BlockStatement',
  SleepStatement: 'SleepStatement',
  ArrayPattern: 'ArrayPattern',
  ObjectPattern: 'ObjectPattern',
  RestElement: 'RestElement',
  AssignmentPattern: 'AssignmentPattern',
  Property: 'Property',
  FunctionExpression: 'FunctionExpression',
  ReturnStatement: 'ReturnStatement',
}

export const ReservedKeyList = [
  ['undefined', TOKEN_TYPE.undefined],
  ['function', TOKEN_TYPE.function],
  ['class', TOKEN_TYPE.class],
  ['null', TOKEN_TYPE.null],
  ['true', TOKEN_TYPE.true],
  ['false', TOKEN_TYPE.false],
  ['extends', TOKEN_TYPE.extends],
  ['static', TOKEN_TYPE.static],
  ['super', TOKEN_TYPE.super],
  ['new', TOKEN_TYPE.new],
  ['typeof', TOKEN_TYPE.typeof],
  ['instanceof', TOKEN_TYPE.instanceof],
  ['void', TOKEN_TYPE.void],
  ['delete', TOKEN_TYPE.delete],
  ['return', TOKEN_TYPE.return],
  ['if', TOKEN_TYPE.if],
  ['else', TOKEN_TYPE.else],
  ['this', TOKEN_TYPE.this],
  ['for', TOKEN_TYPE.for],
  ['of', TOKEN_TYPE.of],
  ['in', TOKEN_TYPE.in],
  ['continue', TOKEN_TYPE.continue],
  ['break', TOKEN_TYPE.break],
  ['while', TOKEN_TYPE.while],
  ['async', TOKEN_TYPE.async],
  ['yield', TOKEN_TYPE.yield],
  ['await', TOKEN_TYPE.await],
  ['throw', TOKEN_TYPE.throw],
  ['var', TOKEN_TYPE.var],
  ['let', TOKEN_TYPE.let],
  ['const', TOKEN_TYPE.const],
  ['set', TOKEN_TYPE.set],
  ['get', TOKEN_TYPE.get],
  ['debugger', TOKEN_TYPE.debugger],
  ['constructor', TOKEN_TYPE.constructor],
  ['switch', TOKEN_TYPE.switch],
  ['case', TOKEN_TYPE.case],
  ['default', TOKEN_TYPE.default],
  ['try', TOKEN_TYPE.try],
  ['catch', TOKEN_TYPE.catch],
  ['finally', TOKEN_TYPE.finally],
  ['arguments', TOKEN_TYPE.arguments],
  ['NaN', TOKEN_TYPE.NaN],
  ['do', TOKEN_TYPE.do],
  ['sleep', TOKEN_TYPE.sleep],
]

export const METHOD_TYPE = {
  getSequenceExpression: 'getSequenceExpression',
  getSpreadElement: 'getSpreadElement',
  getYieldExpression: 'getYieldExpression',
  getAssignmentExpression: 'getAssignmentExpression',
  getConditionalExpression: 'getConditionalExpression',
  getOrExpression: 'getOrExpression',
  getDoubleQuestionExpression: 'getDoubleQuestionExpression',
  getAndExpression: 'getAndExpression',
  getSingleOrExpression: 'getSingleOrExpression',
  getSingleXorExpression: 'getSingleXorExpression',
  getSingelAndExpression: 'getSingelAndExpression',
  getEqualOrNoExpression: 'getEqualOrNoExpression',
  getCompareExpression: 'getCompareExpression',
  getShiftExpression: 'getShiftExpression',
  getSubOrPlusExpression: 'getSubOrPlusExpression',
  getMulOrDivOrModExpression: 'getMulOrDivOrModExpression',
  getDoubleStarExpression: 'getDoubleStarExpression',
  getUnaryOrUpdateOrAwaitExpression: 'getUnaryOrUpdateOrAwaitExpression',
  getSuffixUpdateExpression: 'getSuffixUpdateExpression',
  getNewExpression: 'getNewExpression',
  getMemberOrCallExpression: 'getMemberOrCallExpression',

  getIdentifierAst: 'getIdentifierAst',
  getPrimaryAst: 'getPrimaryAst',
  getLiteralAst: 'getLiteralAst',
  getSleepStatement: 'getSleepStatement',
  getExpAst: 'getExpAst',
  getArrayExpressionAst: 'getArrayExpressionAst',
  getObjectExpressionAst: 'getObjectExpressionAst',
  getExpressionStatementAst: 'getExpressionStatementAst',
  getVariableDeclaratorAst: 'getVariableDeclaratorAst',
  getVariableDeclarationStatementAst: 'getVariableDeclarationStatementAst',
  getStatementOrExpressionAst: 'getStatementOrExpressionAst',
  getIfStatementAst: 'getIfStatementAst',
  getBlockStatementAst: 'getBlockStatementAst',
  getReturnStatementAst: 'getReturnStatementAst',

  getPatternAst: 'getPatternAst',
  getArrayPatternAst: 'getArrayPatternAst',
  getObjectPatternAst: 'getObjectPatternAst',
  getRestElementAst: 'getRestElementAst',
  getAssignmentPatternAst: 'getAssignmentPatternAst',
  getObjectPatternPropertyAst: 'getObjectPatternPropertyAst',
  getObjectPatternPropertyOrRestElementAst: 'getObjectPatternPropertyOrRestElementAst', 
  getAssignmentPatternOrIdentityAst: 'getAssignmentPatternOrIdentityAst',


  getObjectExpressionPropertyAst: 'getObjectExpressionPropertyAst',
  getObjectExpressionPropertyOrSpreadElementAst: 'getObjectExpressionPropertyOrSpreadElementAst',

  getFunctionParams: 'getFunctionParams',
}

export const AstConfigDicts = {
  canSpreadable: 'canSpreadable',
  canYieldable: 'canYieldable',
  canUseAssignmentPattern: 'canUseAssignmentPattern',
  canRestAble: 'canRestAble',
}