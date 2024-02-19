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
  Star: '* Star',
  Div: '/ Div',
  Plus: '+ Plus',
  Subtract: '- Subtract',
  Word: 'Word',
  String: 'String',
  Number: 'Number',
  Optional: '?. Optional',
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
  PlusEqual: '+= PlusEqual',
  SubEqual: '-= SubEqual',
  StarEqual: '*= StarEqual',
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
  Arrow: '=> Arrow',
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
  FunctionDeclaration: 'FunctionDeclaration',
  WhileStatement: 'WhileStatement',
  ArrowFunctionExpression: 'ArrowFunctionExpression',
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

  getFunctionDeclarationAst: 'getFunctionDeclarationAst',
  getFunctionExpressionOrWithArrowAst: 'getFunctionExpressionOrWithArrowAst',
  getFunctionParams: 'getFunctionParams',
  getWhileStatementAst: 'getWhileStatementAst',
  getArrowFunctionExpressionAst: 'getArrowFunctionExpressionAst',
  getThisExpressionAst: 'getThisExpressionAst',

  getObjectProperties: 'getObjectProperties',
  getObjectPropertyMethod: 'getObjectPropertyMethod',
}

export const AstFlagDicts = {
  canAwaitable: 'canAwaitable',
  canSpreadable: 'canSpreadable',
  canYieldable: 'canYieldable',
  canUseAssignmentPattern: 'canUseAssignmentPattern',
  canRestable: 'canRestable',
  cannotUsePureArrowExpression: 'cannotUsePureArrowExpression',
}

export const METHOD_TYPE_VALUES_LIST = _.values(METHOD_TYPE);

export const TOKEN_TYPE_VALUE_LIST = _.values(TOKEN_TYPE);

export const AST_FLAG_VALUE_LIST = _.values(AstFlagDicts);

export const AST_TYPE_VALUE_LIST = _.values(AST_TYPE);

export const prefixDicts = {
  is: 'is',
  set: 'set',
  reset: 'reset',
}

export const commonLiteral = {
  init: 'init'
}

export const literalAstToValue = {
  [TOKEN_TYPE.false]: false,
  [TOKEN_TYPE.true]: true,
  [TOKEN_TYPE.null]: null,
}

export const directlyReturnFlag = '_self';


export const definePriorityConfig = [
  [
    METHOD_TYPE.getDoubleStarExpression,
    'getPriorityAstFunc',
    [
      TOKEN_TYPE.DoubleStar
    ],
    AST_TYPE.BinaryExpression
  ],
  [
    METHOD_TYPE.getMulOrDivOrModExpression,
    'getPriorityAstFunc',
    [
      TOKEN_TYPE.Star,
      TOKEN_TYPE.Div,
      TOKEN_TYPE.Mod
    ],
    AST_TYPE.BinaryExpression
  ],
  [
    METHOD_TYPE.getSubOrPlusExpression,
    'getPriorityAstFunc',
    [
      TOKEN_TYPE.Plus,
      TOKEN_TYPE.Subtract,
    ],
    AST_TYPE.BinaryExpression
  ],
  [
    METHOD_TYPE.getShiftExpression,
    'getPriorityAstFunc',
    [
      TOKEN_TYPE.ShiftLeft,
      TOKEN_TYPE.ShiftRight,
      TOKEN_TYPE.UnsignedShiftRight
    ],
    AST_TYPE.BinaryExpression
  ],
  [
    METHOD_TYPE.getCompareExpression,
    'getPriorityAstFunc',
    [
      TOKEN_TYPE.Less,
      TOKEN_TYPE.LessEqual,
      TOKEN_TYPE.Great,
      TOKEN_TYPE.GreatEqual,
      TOKEN_TYPE.in,
      TOKEN_TYPE.instanceof
    ],
    AST_TYPE.BinaryExpression
  ],
  [
    METHOD_TYPE.getEqualOrNoExpression,
    'getPriorityAstFunc',
    [
      TOKEN_TYPE.NoCompare,
      TOKEN_TYPE.Compare,
      TOKEN_TYPE.NoStrictEqual,
      TOKEN_TYPE.StrictEqual,
    ],
    AST_TYPE.BinaryExpression
  ],
  [
    METHOD_TYPE.getSingelAndExpression,
    'getPriorityAstFunc',
    TOKEN_TYPE.SingelAnd,
    AST_TYPE.BinaryExpression
  ],
  [
    METHOD_TYPE.getSingleXorExpression,
    'getPriorityAstFunc',
    TOKEN_TYPE.SingleXor,
    AST_TYPE.BinaryExpression
  ],
  [
    METHOD_TYPE.getSingleOrExpression,
    'getPriorityAstFunc',
    TOKEN_TYPE.SingleOr,
    AST_TYPE.BinaryExpression
  ],
  [
    METHOD_TYPE.getAndExpression,
    'getPriorityAstFunc',
    TOKEN_TYPE.And,
    AST_TYPE.LogicalExpression
  ],
  [
    METHOD_TYPE.getDoubleQuestionExpression,
    'getPriorityAstFunc',
    TOKEN_TYPE.DoubleQuestion,
    AST_TYPE.LogicalExpression,
  ],
  [
    METHOD_TYPE.getOrExpression,
    'getPriorityAstFunc',
    TOKEN_TYPE.OR,
    AST_TYPE.LogicalExpression,
  ]
]