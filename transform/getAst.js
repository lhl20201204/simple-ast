import parse from "./parse";

const DICTS = {
  WORD: "word",
  SIGN: "sign",
  NUMBER: "number",
  REMARK: "remark",
  STRING: "string",
};

const SIGNS = {
  ADD: "+",
  SUB: "-",
  MUL: "*",
  DIV: "/",
  OR: "|",
  AND: "&",
  EQU: "=",
  COMMA: ",",
  SEMICOLON: ";",
  LeftParenthesis: "(",
  RightParenthesis: ")",
  BIGLeftParenthesis: "{",
  BIGRightParenthesis: "}",
  COLON: ':',
  MIDLeftParenthesis: "[",
  MIDRightParenthesis: "]",
};

const KEYWORD = {
  VAR: "var",
  LET: "let",
  CONST: "const",
  FUNCTION: "function",
};
const VariableDeclarationDicts = [KEYWORD.VAR, KEYWORD.LET, KEYWORD.CONST];

const operators = [
  SIGNS.ADD,
  SIGNS.SUB,
  SIGNS.MUL,
  SIGNS.DIV,
  SIGNS.OR,
  SIGNS.AND,
];

export class AST { 
  static selectMethod = 'isArrayExpression';
  constructor(list) {
    this.list = list;
  }

  get(start, end) {
    return this.list
      .slice(start, end + 1)
      .map((x) => x.value)
      .join("");
  }

  log(start, end, ...args) {
    console.log(this.get(start, end), ...args);
  }

  includes(start, end, value) {
    for(let i = start; i <=end; i++) {
      if(this.list[i].value === value) {
        return true
      }
    }
    return false
  }

  includesALL(start, end, arr=[]) { // 提高性能，一次性判断
    const flag = new Map()
    for(let i = start; i <=end; i++) {
      const v = this.list[i].value
      if(arr.includes(v)) {
        flag.set(v, true)
        if (flag.size === arr.length){
          return true
        }
      }
    }
    return false
  }

  getStartEnd(start, end) {
    return {
      start: this.list[start].start,
      end: this.list[end].end,
    };
  }

  isEqual(i) {
    return this.list[i]?.value === SIGNS.EQU;
  }

  isComma(i) {
    return this.list[i]?.value === SIGNS.COMMA;
  }

  isSemicolon(i) {
    return this.list[i]?.value === SIGNS.SEMICOLON;
  }

  isLeftParenthesis(i) {
    return this.list[i]?.value === SIGNS.LeftParenthesis;
  }

  isRightParenthesis(i) {
    return this.list[i]?.value === SIGNS.RightParenthesis;
  }

  isBIGLeftParenthesis(i) {
    return this.list[i]?.value === SIGNS.BIGLeftParenthesis;
  }

  isBIGRightParenthesis(i) {
    return this.list[i]?.value === SIGNS.BIGRightParenthesis;
  }

  isCOLON(i) {
    return this.list[i]?.value === SIGNS.COLON;
  }

  isMidLeftParenthesis(i) {
    return this.list[i]?.value === SIGNS.MIDLeftParenthesis;
  }

  isMidRightParenthesis(i) {
    return this.list[i]?.value === SIGNS.MIDRightParenthesis;
  }
  
  isDeclareKind(i) {
    const item = this.list[i];
    return VariableDeclarationDicts.includes(item.value);
  }

  isOperator(i) {
    const item = this.list[i];
    return operators.includes(item.value);
  }

  isIdentifier(i) {
    const item = this.list[i];
    if (item.type === DICTS.WORD) {
      return {
        type: "Identifier",
        ...this.getStartEnd(i, i),
        name: item.value,
      };
    }
    return null;
  }

  isLiteral(i) {
    const item = this.list[i];
    if ([DICTS.NUMBER, DICTS.STRING].includes(item.type)) {
      return {
        type: "Literal",
        ...this.getStartEnd(i, i),
        value: item.value,
        raw: '"' + item.value + '"',
      };
    }
    return null;
  }

  isAssignmentPattern(start, end) {
    const item = this.isAssignmentExpression(start, end);
    if (!item) {
      return null;
    }
    return {
      ...item,
      type: "AssignmentPattern",
    };
  }

  isCommonProperty(start, end) {
    const first = this.isIdentifier(start);
    if (start === end && first) {
      return {
        type: "Property",
        ...this.getStartEnd(start, end),
        method: false,
        shorthand: true,
        computed: false,
        key: first,
        kind: "init",
        value: first,
      };
    } else if (this.includes(start, end, SIGNS.COLON)) {
      if (!first || !this.isCOLON(start + 1)) {
        return null
      }
      const right = this.isExpression(start + 2, end)
      if (right) {
        return {
          type: "Property",
          ...this.getStartEnd(start, end),
          method: false,
          shorthand: false,
          computed: false,
          key: first,
          value: right,
          kind: 'init',
        }
      }
    } 
    return null
  }

  isAssignmentProperty(start, end){
    if(start + 1 > end || !this.includes(start, end, SIGNS.EQU)){
      return null
    }
    const assignmentPattern = this.isAssignmentPattern(start, end);
      if (assignmentPattern) {
        return {
          type: "Property",
          ...this.getStartEnd(start, end),
          method: false,
          shorthand: true,
          computed: false,
          key: assignmentPattern.left,
          kind: "init",
          value: assignmentPattern,
        };
      }
    return null
  }

  isIdentifierProperty(start, end) {
    if (start > end || !this.includesALL(start, end, [SIGNS.MIDLeftParenthesis, SIGNS.MIDRightParenthesis, SIGNS.COLON])){
      return null
    }
    const first = this.isMidLeftParenthesis(start)
    if (first) {
      for(let i = start + 1; i <= end; i++) {
         if (!this.isMidRightParenthesis(i) || !this.isCOLON(i + 1)){
          continue
         }
         const left = this.isExpression(start + 1, i -1);
         const right = this.isExpression(i+2, end);
         if (left && right) {
          return {
            type: "Property",
            ...this.getStartEnd(start, end),
            method: false,
            shorthand: false,
            computed: true,
            key: left,
            value: right,
            kind: 'init'
          }
         }
      }
    }

  }

  isObjectExpressionProperty(start, end) { // 这俩个后续可以抽一下
    return this.isCommonProperty(start, end) || this.isIdentifierProperty(start, end)
  }

  isParamsProperty(start, end) { // 这俩个后续可以抽一下
    return this.isCommonProperty(start, end) || this.isAssignmentProperty(start,end)
  }

  isObjectPatternProperties(start, end) {
    if (start > end) {
      return null
    }
    const property = this.isParamsProperty(start, end) 
    if (property) {
      return [
        property
      ]
    }
    if (this.includes(start, end, SIGNS.COMMA)) {
      for(let i= start; i<=end; i++) {
         if(!this.isComma(i)){
          continue;
         }
         const left = this.isParamsProperty(start, i -1)
         const right = this.isObjectPatternProperties(i+1, end)
         if (left && right) {
          return [
            left,
            ...right,
          ]
         }
      }
    }
    return null
  }

  isObjectExpressionProperties(start, end) {
    if (start > end) {
      return null
    }
    const property = this.isObjectExpressionProperty(start, end) 
    if (property) {
      return [
        property
      ]
    }
    if (this.includes(start, end, SIGNS.COMMA)) {
      for(let i= start; i<=end; i++) {
         if(!this.isComma(i)){
          continue;
         }
         const left = this.isObjectExpressionProperty(start, i -1)
         const right = this.isObjectExpressionProperties(i+1, end)
         if (left && right) {
          return [
            left,
            ...right,
          ]
         }
      }
    }
    return null
  }

  isObjectPattern(start, end) {
    if (
      start >= end ||
      !this.isBIGLeftParenthesis(start) ||
      !this.isBIGRightParenthesis(end)
    ) {
      return null;
    }

   
    if (start + 1 === end) {
      return {
        type: 'ObjectPattern',
        ...this.getStartEnd(start, end),
        properties: []
      };
    } 
    const properties = this.isObjectPatternProperties(start + 1, end - 1)
    if (properties) {
      return {
        type: 'ObjectPattern',
        ...this.getStartEnd(start, end),
        properties
      };
    }
  }

  isParamsItem(start, end) {
    return (
      (start === end && this.isIdentifier(start)) ||
      this.isObjectPattern(start, end) ||
      this.isAssignmentPattern(start, end)
    );
  }

  isParams(start, end) {
    if (start > end || this.isComma(start)) {
      return null;
    }
    const paramsChild = this.isParamsItem(start, end);
    if (paramsChild) {
      return [paramsChild];
    }

    if (!this.includes(start, end, SIGNS.COMMA)) {
      return null;
    }
    for (let i = start; i <= end; i++) {
      if (!this.isComma(i)) {
        continue;
      }
      const left = this.isParamsItem(start, i - 1);
      const right = this.isParams(i + 1, end);
      if (left && right) {
        return [left, ...right];
      }
    }
    return null;
  }
  // 声明

  isVariableDeclarator(start, end) {
    const id = this.isIdentifier(start);
    if (end < start + 2 || !id || !this.isEqual(start + 1)) {
      return null;
    }
    const right = this.isExpression(start + 2, end);
    if (right) {
      return {
        type: "VariableDeclarator",
        ...this.getStartEnd(start, end),
        id,
        init: right,
      };
    }
  }

  isDeclarations(start, end) {
    const ret = this.isVariableDeclarator(start, end);
    if (ret) {
      return [ret];
    }

    for (let i = start; i <= end; i++) {
      if (!this.isComma(i)) {
        continue;
      }
      const left = this.isVariableDeclarator(start, i - 1);
      const right = this.isDeclarations(i + 1, end);
      if (left && right) {
        return [left, ...right];
      }
    }

    return null;
  }

  isVariableDeclaration(start, end) {
    if (end < start + 3) {
      return null;
    }
    if (this.isDeclareKind(start)) {
      if (this.isSemicolon(end)) {
        end = end - 1;
      }
      const declarations = this.isDeclarations(start + 1, end);
      if (declarations) {
        return {
          type: "VariableDeclaration",
          ...this.getStartEnd(start, end),
          declarations,
          kind: this.list[start].value,
        };
      }
    }
    return null;
  }

  isClassDeclaration(start, end) {}

  isFunctionDeclaration(start, end) {}

  isClassBody(start, end) {}

  isPropertyDefinition(start, end) {}

  isMethodDefinition(start, end) {}

  // 表达式

  isExpression(start, end) {
    if (start > end){
      return
    }
    return (
      (start === end && (this.isLiteral(start) || this.isIdentifier(start))) ||
      this.isAssignmentExpression(start, end) ||
      this.isObjectExpression(start,end)||
      this.isBinaryExpression(start, end) ||
      this.isFunctionExpression(start, end) ||
      this.isCallExpression(start, end) ||
      this.isMemberExpression(start, end) ||
      this.isArrowFunctionExpression(start, end) ||
      this.isNewExpression(start, end) ||
      this.isArrayExpression(start, end) ||
      this.isAwaitExpression(start, end) ||
      (this.isLeftParenthesis(start) &&
        this.isRightParenthesis(end) &&
        this.isExpression(start + 1, end - 1))
    );
  }

  isBinaryExpression(start, end) {
    if (end < start + 2) {
      return null;
    }
    for (let i = start; i <= end; i++) {
      if (!this.isOperator(i)) {
        continue;
      }
      const left = this.isExpression(start, i - 1);
      const right = this.isExpression(i + 1, end);
      if (left && right) {
        return {
          type: "BinaryExpression",
          ...this.getStartEnd(start, end),
          left,
          right,
          operator: this.list[i].value,
        };
      }
    }
    return null;
  }

  isFunctionExpression(start, end) {
    const item = this.list[start];
    if (item.value !== KEYWORD.FUNCTION) {
      return null;
    }
  }

  isCallExpression(start, end) {}

  isAssignmentExpression(start, end) {
    const id = this.isIdentifier(start);
    if (end < start + 2 || !id || !this.isEqual(start + 1)) {
      return null;
    }
    const right = this.isExpression(start + 2, end);
    if (right) {
      return {
        type: "AssignmentExpression",
        ...this.getStartEnd(start, end),
        operators: "=",
        left: id,
        right,
      };
    }
  }

  isObjectExpression(start, end) {
    if (
      start >= end ||
      !this.isBIGLeftParenthesis(start) ||
      !this.isBIGRightParenthesis(end)
    ) {
      return null;
    }

    if (start + 1 === end) {
      return {
        type: 'ObjectExpression',
        ...this.getStartEnd(start, end),
        properties: []
      };
    } 
    const properties = this.isObjectExpressionProperties(start + 1, end - 1)
    if (properties) {
      return {
        type: 'ObjectExpression',
        ...this.getStartEnd(start, end),
        properties
      };
    }
     
  }

  isMemberExpression(start, end) {}

  isArrowFunctionExpression(start, end) {}

  isNewExpression(start, end) {}

  isElements(start, end) {
    if (start > end) {
      return []
    }
    const expression = this.isExpression(start, end)
    if(expression) {
      return [
        expression,
      ]
    }
    if (!this.includes(start, end, SIGNS.COMMA)){
      return null
    }
    for(let i= start; i<=end;i++){
      if(!this.isComma(i)){
        continue
      }
      const left = this.isExpression(start, i-1)
      const right = this.isElements(i+1, end)
      if(left && right){
        return [
          left,
          ...right,
        ]
      }
    }
  }

  isArrayExpression(start, end) {
    if (!this.isMidLeftParenthesis(start) || !this.isMidRightParenthesis(end)) {
      return null;
    }
    const elements = this.isElements(start+1, end -1)
    if(elements) {
      return {
        type: 'ArrayExpression',
        ...this.getStartEnd(start, end),
        elements,
      }
    }
  }

  isAwaitExpression(start, end) {}

  // 语句

  isEmptyStatement(start, end) {
    if (start !== end || !this.isSemicolon(start)) {
      return null;
    }
    return {
      ...this.getStartEnd(start, end),
      type: "EmptyStatement",
    };
  }

  isExpressionStatement(start, end) {}

  isForStatement(start, end) {}

  isIfStatement(start, end) {}

  isBlockStatement(start, end) {}

  isStatement(start, end) {
    return this.isEmptyStatement(start, end);
  }

  isDeclaration(start, end) {
    return this.isVariableDeclaration(start, end);
  }

  isDeclarationOrStatement(start, end) {
    return this.isDeclaration(start, end) || this.isStatement(start, end);
  }

  isProgram(start, end) {
    if (start >= end) {
      return {
        body: [],
      };
    }
    for (let i = start; i <= end; i++) {
      const left = this.isDeclarationOrStatement(start, i);
      const right = this.isProgram(i + 1, end);
      if (left && right) {
        return {
          type: "Program",
          ...this.getStartEnd(start, end),
          body: [left, ...right.body],
          sourceType: "module",
        };
      }
    }
    return null;
  }
}

export default function getAst(str) {
  const wordList = parse(str);
  if (wordList instanceof Error) {
    return wordList;
  }
  const list = wordList.filter((x) => x.type !== DICTS.REMARK);
  const ast = new AST(list);

  try {
    const tree = ast[AST.selectMethod](0, list.length - 1);
    console.log(AST.selectMethod, tree, wordList);
    if (!tree) {
      return new Error();
    }

    const writeJSON = (obj, prefix, name) => {
      const ret = [];
      const prefixSpace = new Array(prefix)
        .fill(0)
        .map((v) => " ")
        .join("");

      for (const attr in obj) {
        const t = obj[attr];
        if (t instanceof Object) {
          const child = writeJSON(t, prefix + 2, attr);
          ret.push(
            prefixSpace +
              `${attr * 1 == attr ? "" : attr + ": "}` +
              `${Array.isArray(t) ? "[" : "{"}\n`
          );
          ret.push(...child.join(""));
          ret.push(prefixSpace + `${Array.isArray(t) ? "]," : "},"}\n`);
        } else {
          ret.push(
            prefixSpace +
              attr +
              ": " +
              (typeof t === "number" ? t : '"' + t + '"') +
              ",\n"
          );
        }
      }
      return ret;
    };
    return "{\n" + writeJSON(tree, 2).join("") + "}";
  } catch (e) {
    console.error(e);
    return new Error();
  }
}
