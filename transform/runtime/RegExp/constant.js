import { createAcceptStr } from "./util"

export const AST_TYPE = {
  RegExpLiteral: 'RegExpLiteral',
  Pattern: 'Pattern',
  Alternative: 'Alternative',
  Quantifier: 'Quantifier',
  CharacterClass: 'CharacterClass',
  CharacterClassRange: 'CharacterClassRange',
  Character: 'Character',
  CharacterSet: 'CharacterSet',
  Assertion: 'Assertion',
  Flags: 'Flags',
  CapturingGroup: 'CapturingGroup',
  Group: 'Group',
  Backreference: 'Backreference',
}

// \d、\D、\s、\S、\w、\W（分别代表数字、非数字、空白字符、非空白字符、单词字符、非单词字符）
export const TOKEN_TYPE = {
   Group: '(?: Group',
   Exclude: '[^ Exclude',
   NotGreedyMatch: '*? NotGreedyMatch',
   Lookahead: '(?= Lookahead',
   LookAheagNegate: '(?! LookAheagNegate',
   Lookbehind: '(?<= Lookbehind',
   LookbehindNegate: '(?<! LookbehindNegate',
   GroupPrefix: '(? GroupPrefix',
   Or: '| Or',
   Point: '. Point',
   DNumber: '\\d DNumber',
   NotDNumber: '\\D NotDNumber',
   Space: '\\s Space',
   NotSpace: '\\S NotSpace',
   Alpha: '\\w Alpha',
   NotAlpha: '\\W NotAlpha',
   LeftParenthesis: '( LeftParenthesis',
   RightParenthesis: ') RightParenthesis',
   LeftBracket: '[ LeftBracket',
   RightBracket: '] RightBracket',
   LeftBrace: '{ LeftBrace',
   RightBrace: '} RightBrace',
   Join: '- Join',
  //  Tab: '\t Tab',
  //  Enter: '\r Enter',
   WrapLine: '\n WrapLine',
   Page: '\\f Page',
  //  Command: '\\c Command',
   VerticalTab: '\\v VerticalTab',
   DemarcationLine: '\\b DemarcationLine',
   NotDemarcationLine: '\\B NotDemarcationLine',
   Start: '^ Start',
   End: '$ End',
   Plus: '+ Plus',
   Star: '* Star',
   Question: '? Question',
   Comma: ', Comma',
   Div: '/ Div',
   Slant: '\\ Slant',
   Character: 'Character',
   Number: 'Number',
}

export const METHOD_TYPE = {
  getRegExpLiteralAst: 'getRegExpLiteralAst',
  getPatternAst: 'getPatternAst',
  getAlternativeList: 'getAlternativeList',
  getAlternativeAst: 'getAlternativeAst',
  getQuantifierAst: 'getQuantifierAst',
  getCharacterClassAst: 'getCharacterClassAst',
  getCharacterClassRangeAst: 'getCharacterClassRangeAst',
  getCharacterAst: 'getCharacterAst',
  getFlagsAst: 'getFlagsAst',
  getAtomAst: 'getAtomAst',
  getCharset: 'getCharset',
  getCapturingGroupAst: 'getCapturingGroupAst',
  getAssertionAst: 'getAssertionAst',
  getGroupAst: 'getGroupAst',
  getCharacterSetAst: 'getCharacterSetAst',
  getBackreferenceOrCharacterAst: 'getBackreferenceOrCharacterAst',
  getMayBeClassRangeOrCharacterSetOrCharacterAst: 'getMayBeClassRangeOrCharacterSetOrCharacterAst'
}

export const CharacterSetAstTokenList = [
  TOKEN_TYPE.Point,
  TOKEN_TYPE.DNumber,
  TOKEN_TYPE.NotDNumber,
  TOKEN_TYPE.Alpha,
  TOKEN_TYPE.NotAlpha,
  TOKEN_TYPE.Space,
  TOKEN_TYPE.NotSpace,
  // TOKEN_TYPE.Tab,
  // TOKEN_TYPE.Enter,
  // TOKEN_TYPE.WrapLine,
]

export const AstFlagDicts = {
  canMatchNum: 'canMatchNum',
  canUseJoin: 'canUseJoin',
  canUseSlant: 'canUseSlant',
  cannotUseSpecialSignExcludeJoin: 'cannotUseSpecialSignExcludeJoin',
  canUseGroupPrefix: 'canUseGroupPrefix',
  canMacthLT77: 'canMacthLT77',
}

export const prefixDicts = {
  push: 'push',
  get: 'get',
  is: 'is',
  set: 'set',
  reset: 'reset',
}

export const AST_FLAG_VALUE_LIST = _.keys(AstFlagDicts)

export const AST_TYPE_VALUE_LIST = _.values(AST_TYPE);

export const TOKEN_TYPE_VALUE_LIST = _.values(TOKEN_TYPE);

export const METHOD_TYPE_VALUES_LIST = _.values(METHOD_TYPE);


export const Epsilon = createAcceptStr('ε')

export const TAG_DICTS = {
  NORMAL: 'NORMAL',
  START: 'START',
  END: 'END',
}