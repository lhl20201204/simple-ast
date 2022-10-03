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
  COLON: ":",
  MIDLeftParenthesis: "[",
  MIDRightParenthesis: "]",
  DOT: ".",
  ASTERISK: "*",
  Bigger: '>'
};

const KEYWORD = {
  VAR: "var",
  LET: "let",
  CONST: "const",
  FUNCTION: "function",
  ASYNC: "async",
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

const REGS = {
  funcExpression:
    /^(async\$)?function\$(\*\$)?([\w]*?\$)?\(\$?(\$(.*?)?\$)?\)\$\{\$?(\$(.*?)\$)?\}$/,
  funcDeclaration:
    /^(async\$)?function\$(\*\$)?([\w]*?\$)\(\$?(\$(.*?)?\$)?\)\$\{\$?(\$(.*?)\$)?\}$/,
  arrowFuncExpression:
  /^(async\$)?((\(\$?(\$(.*?)?\$)?\))|([\w]*?))\$=\$>\$(.*?)$/
};

export class AST {
  static selectMethod = "isArrowFunctionExpression";
  constructor(list) {
    this.list = list;
  }

  get(start, end, sign = "$") {
    return this.list
      .slice(start, end + 1)
      .map((x) => x.value)
      .join(sign);
  }

  log(start, end, ...args) {
    console.log(this.get(start, end, ""), ...args);
  }

  hasSign(start, end, method) {
    const fn = method.bind(this);
    for (let i = start; i <= end; i++) {
      if (fn?.(i)) {
        return true;
      }
    }
    return false;
  }

  includesALL(start, end, arr = []) {
    // 提高性能，一次性判断
    const flag = new Map();
    for (let i = start; i <= end; i++) {
      const v = this.list[i].value;
      if (arr.includes(v)) {
        flag.set(v, true);
        if (flag.size === arr.length) {
          return true;
        }
      }
    }
    return false;
  }

  rightDfs(start, end, leftMethod, rightMethod, callback) {
    const leftFn = leftMethod.bind(this)
    const rightFn = rightMethod.bind(this)
    const left = leftFn(start, end)
    if (left) {
      return callback(left, null)
    }
    for (let i = start; i <= end; i++) {
      const left = leftFn(start, i);
      const right = rightFn(i + 1, end);
      if (left && right) {
        return callback(left, right);
      }
    }
    return null;
  }

  breakUpBySign(start, end, signMethod, leftMethod, rightMethod, callback) {
    const fn = signMethod.bind(this);
    const leftFn = leftMethod.bind(this);
    const rightFn = rightMethod.bind(this);
    callback = callback || ((left, right) => [left, ...right]);
    if (!fn || !leftFn || !rightFn) {
      throw new Error("break up 方法调用不存在");
    }
    if (!this.hasSign(start, end, fn)) {
      return null;
    }

    for (let i = start; i <= end; i++) {
      if (!fn(i)) {
        continue;
      }
      const left = leftFn(start, i - 1);
      const right = rightFn(i + 1, end);
      if (left && right) {
        return callback(left, right, i);
      }
    }
    return null;
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

  isDot(i) {
    return this.list[i]?.value === SIGNS.DOT;
  }

  isAsync(i) {
    return this.list[i]?.value === KEYWORD.ASYNC;
  }

  isFuncKeyWord(i) {
    return this.list[i]?.value === KEYWORD.FUNCTION;
  }

  isAsterisk(i) {
    return this.list[i]?.value === SIGNS.ASTERISK;
  }

  isBigger(i) {
    return this.list[i]?.value === SIGNS.Bigger
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
    const item = this.list[i] || {};
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
    const item = this.list[i] || {};
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
    } else if (this.hasSign(start, end, this.isCOLON)) {
      if (!first || !this.isCOLON(start + 1)) {
        return null;
      }
      const right = this.isExpression(start + 2, end);
      if (right) {
        return {
          type: "Property",
          ...this.getStartEnd(start, end),
          method: false,
          shorthand: false,
          computed: false,
          key: first,
          value: right,
          kind: "init",
        };
      }
    }
    return null;
  }

  isAssignmentProperty(start, end) {
    if (start + 1 > end || !this.hasSign(start, end, this.isEqual)) {
      return null;
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
    return null;
  }
  /*
  todo 
 {
  [a](){
  }
}
 */
  isIdentifierProperty(start, end) {
    if (
      start > end ||
      !this.includesALL(start, end, [
        SIGNS.MIDLeftParenthesis,
        SIGNS.MIDRightParenthesis,
        SIGNS.COLON,
      ])
    ) {
      return null;
    }
    const first = this.isMidLeftParenthesis(start);
    if (first) {
      for (let i = start + 1; i <= end; i++) {
        if (!this.isMidRightParenthesis(i) || !this.isCOLON(i + 1)) {
          continue;
        }
        const left = this.isExpression(start + 1, i - 1);
        const right = this.isExpression(i + 2, end);
        if (left && right) {
          return {
            type: "Property",
            ...this.getStartEnd(start, end),
            method: false,
            shorthand: false,
            computed: true,
            key: left,
            value: right,
            kind: "init",
          };
        }
      }
    }
  }

  isSpreadElement(start, end) {
    if (
      start + 3 > end ||
      !this.isDot(start) ||
      !this.isDot(start + 1) ||
      !this.isDot(start + 2)
    ) {
      return null;
    }
    const argument = this.isExpression(start + 3, end);
    if (argument) {
      return {
        type: "SpreadElement",
        ...this.getStartEnd(start, end),
        argument,
      };
    }
    return null;
  }

  isObjectExpressionProperty(start, end) {
    // 这俩个后续可以抽一下
    return (
      this.isCommonProperty(start, end) ||
      this.isIdentifierProperty(start, end) ||
      this.isSpreadElement(start, end)
    );
  }

  isParamsProperty(start, end) {
    // 这俩个后续可以抽一下
    return (
      this.isCommonProperty(start, end) ||
      this.isAssignmentProperty(start, end) ||
      this.isSpreadElement(start, end)
    );
  }

  isObjectPatternProperties(start, end) {
    if (start > end) {
      return [];
    }
    const property = this.isParamsProperty(start, end);
    if (property) {
      return [property];
    }
    return this.breakUpBySign(
      start,
      end,
      this.isComma,
      this.isParamsProperty,
      this.isObjectPatternProperties
    );
  }

  isObjectExpressionProperties(start, end) {
    if (start > end) {
      return [];
    }
    const property = this.isObjectExpressionProperty(start, end);
    if (property) {
      return [property];
    }
    return this.breakUpBySign(
      start,
      end,
      this.isComma,
      this.isObjectExpressionProperty,
      this.isObjectExpressionProperties
    );
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
        type: "ObjectPattern",
        ...this.getStartEnd(start, end),
        properties: [],
      };
    }
    const properties = this.isObjectPatternProperties(start + 1, end - 1);
    if (properties) {
      return {
        type: "ObjectPattern",
        ...this.getStartEnd(start, end),
        properties,
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
    if (start > end) {
      return [];
    }
    const paramsChild = this.isParamsItem(start, end);
    if (paramsChild) {
      return [paramsChild];
    }
    return this.breakUpBySign(
      start,
      end,
      this.isComma,
      this.isParamsItem,
      this.isParams
    );
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
    return this.breakUpBySign(
      start,
      end,
      this.isComma,
      this.isVariableDeclarator,
      this.isDeclarations
    );
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

  isFunctionDeclaration(start, end) {
    return this.isCommonFunction(start, end, REGS.funcDeclaration, 'FunctionDeclaration')
  }

  isClassBody(start, end) {}

  isPropertyDefinition(start, end) {}

  isMethodDefinition(start, end) {}

  // 表达式

  isExpression(start, end) {
    if (start > end) {
      return;
    }
    return (
      (start === end && (this.isLiteral(start) || this.isIdentifier(start))) ||
      this.isAssignmentExpression(start, end) ||
      this.isObjectExpression(start, end) ||
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
    return this.breakUpBySign(
      start,
      end,
      this.isOperator,
      this.isExpression,
      this.isExpression,
      (left, right, i) => ({
        type: "BinaryExpression",
        ...this.getStartEnd(start, end),
        left,
        right,
        operator: this.list[i].value,
      })
    );
  }

  isCommonFunction(start, end, regp, type) {
    if (!this.get(start, end).match(regp)) {
      return null;
    }
    const ss = start;
    const getFnBody = (start, id, generator, isAsync) => {
      if (!this.isBIGRightParenthesis(end)) {
        return null;
      }
      for (let i = start; i <= end; i++) {
        if (!this.isRightParenthesis(i) || !this.isBIGLeftParenthesis(i + 1)) {
          continue;
        }

        const params = this.isParams(start, i - 1);
        const body = this.isBlockStatement(i + 2, end - 1);
        if (params && body) {
          return {
            type,
            ...this.getStartEnd(ss, end),
            id,
            expression: false, //todo 这个待定，不知道怎么触发
            generator,
            async: isAsync,
            params,
            body,
          };
        }
      }
      return null;
    };

    const fn = (start, isAsync) =>
      (this.isAsterisk(start + 2) &&
        ((this.isIdentifier(start + 3) &&
          this.isLeftParenthesis(start + 4) &&
          getFnBody(start + 5, this.isIdentifier(start + 3), true, isAsync)) ||
          (this.isLeftParenthesis(start + 3) &&
          getFnBody(start + 4, null, true, isAsync)))) ||
      (this.isIdentifier(start + 2) &&
        this.isLeftParenthesis(start + 3) &&
        getFnBody(start + 4, this.isIdentifier(start + 2), false, isAsync)) ||
      (this.isLeftParenthesis(start + 2) &&
      getFnBody(start + 3, null, false, isAsync));

    return (
      (this.isAsync(start) &&
        this.isFuncKeyWord(start + 1) &&
        fn(start, true)) ||
      (this.isFuncKeyWord(start) && fn(start - 1, false))
    );
  }

  isFunctionExpression(start, end) {
    return this.isCommonFunction(start, end, REGS.funcExpression, 'FunctionExpression')
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
        operators: SIGNS.EQU,
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
        type: "ObjectExpression",
        ...this.getStartEnd(start, end),
        properties: [],
      };
    }
    const properties = this.isObjectExpressionProperties(start + 1, end - 1);
    if (properties) {
      return {
        type: "ObjectExpression",
        ...this.getStartEnd(start, end),
        properties,
      };
    }
  }

  isMemberExpression(start, end) {}

  isArrowFunctionExpression(start, end) {
    if(!this.get(start, end).match(REGS.arrowFuncExpression)){
      return null
    }
    const ss = start
    const handleBody = (params, i ,isAsync) => {
      if (this.isBIGLeftParenthesis(i ) && this.isBIGRightParenthesis(end)) { // ()=>{}
        const body = this.isBlockStatement(i+1, end -1)
        if (params && body) {
          return {
            type: 'ArrowFunctionExpression',
            ...this.getStartEnd(ss, end),
            id: null,
            expression: false,
            generator: false,
            async: isAsync,
            params,
            body
          }
        }
      } 
      const body = this.isExpression(i, end)
      const isObject = this.isObjectExpression(i, end)
      if (params && body && !isObject) {
        return {
          type: 'ArrowFunctionExpression',
          ...this.getStartEnd(ss, end),
          id: null,
          expression: true,
          generator: false,
          async: isAsync,
          params,
          body
        }
      }
      return null
    }
    const fn = (start, isAsync,) => {
      if (this.isLeftParenthesis(start)) {
        for(let i=start;i <=end;i++) {
          if (!this.isRightParenthesis(i) || !this.isEqual(i+1) || !this.isBigger(i+2)){
            continue;
          }
          const params = this.isParams(start+1, i-1)
          const t = handleBody(params, i+3, isAsync)
          if (t) {
            return t
          }
        }
      } else if (this.isIdentifier(start)) {
        const params = [this.isIdentifier(start)]
        if (!this.isEqual(start+1) || !this.isBigger(start+2)) {
          return null
        }
        return handleBody(params, start + 3, isAsync)
      }
    }
    
    return (this.isAsync(start) && fn(start + 1, true)) || fn(start, false)
  }

  isNewExpression(start, end) {}

  isElements(start, end) {
    if (start > end) {
      return [];
    }
    const expression = this.isExpression(start, end);
    if (expression) {
      return [expression];
    }
    return this.breakUpBySign(
      start,
      end,
      this.isComma,
      this.isExpression,
      this.isElements
    );
  }

  isArrayExpression(start, end) {
    if (!this.isMidLeftParenthesis(start) || !this.isMidRightParenthesis(end)) {
      return null;
    }
    const elements = this.isElements(start + 1, end - 1);
    if (elements) {
      return {
        type: "ArrayExpression",
        ...this.getStartEnd(start, end),
        elements,
      };
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

  isBlockStatement(start, end) {
    if (start > end) {
      return {
        type: 'BlockStatement',
        ...this.getStartEnd(end, end),
        body: []
      };
    }
    return this.rightDfs(start, end, this.isDeclarationOrStatement, this.isBlockStatement, (left, right) => ({
      type: 'BlockStatement',
      ...this.getStartEnd(start, end),
      body: [left, ... (right ? right.body : [])]
    }))
  }

  isReturnStatement(start, end) {}

  isStatement(start, end) {
    return this.isEmptyStatement(start, end);
  }

  isDeclaration(start, end) {
    return this.isVariableDeclaration(start, end) || this.isFunctionDeclaration(start, end);
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
    return this.rightDfs(start, end, this.isDeclarationOrStatement, this.isProgram, (left, right) => ({
      type: 'Program',
      ...this.getStartEnd(start, end),
      body: [left, ... (right ? right.body : [])],
      sourceType: "module",
    }))
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
          ret.push(prefixSpace + attr + ": " + t + ",\n");
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
