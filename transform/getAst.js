import parse from "./parse";
const testingmodule = "isClassDeclaration";
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
  BIGGER: ">",
  QUESTION: "?",
  SMALLER: "<",
  Exclamation: "!",
};

const KEYWORD = {
  VAR: "var",
  LET: "let",
  CONST: "const",
  FUNCTION: "function",
  ASYNC: "async",
  IF: "if",
  FOR: "for",
  RETURN: "return",
  ELSE: "else",
  WHILE: "while",
  CLASS: "class",
  EXTENDS: "extends",
  STATIC: "static",
  AWAIT: 'await',
  NEW: 'new',
  YIELD: 'yield',
};
const KEYWORDLIST = [];
for (const attr in KEYWORD) {
  KEYWORDLIST.push(KEYWORD[attr]);
}
const VariableDeclarationDicts = [KEYWORD.VAR, KEYWORD.LET, KEYWORD.CONST];

const mathOperators = [SIGNS.ADD, SIGNS.SUB, SIGNS.MUL, SIGNS.DIV];

const assignMathOpetators = mathOperators.map((x) => x + SIGNS.EQU);

const BinaryOperators = [...mathOperators, SIGNS.OR, SIGNS.AND];
const LogicalOperators = [
  "!=",
  "!==",
  "==",
  "===",
  ">",
  "<",
  ">=",
  "<=",
  "&&",
  "||",
];

const UnaryOperators = ["!", "~"];

const UpdateOperators = ["++", "--"];

const REGS = {
  funcExpression:
    /^(async\$)?function\$(\*\$)?([\w]+?\$)?\(\$?(\$([\s\S]*?)?\$)?\)\$\{\$?(\$([\s\S]*?)\$)?\}$/,
  funcDeclaration:
    /^(async\$)?function\$(\*\$)?([\w]+?\$)\(\$?(\$([\s\S]*?)?\$)?\)\$\{\$?(\$([\s\S]*?)\$)?\}$/,
  arrowFuncExpression:
    /^(async\$)?((\(\$?(\$([\s\S]*?)?\$)?\))|([\w]*?))\$=>\$([\s\S]*?)$/,
  callExpression: /\(\$?(\$([\s\S]*?)?\$)?\)$/,
  memberExpression: /\.\$|\[\$([\s\S]*?)\$\]/,
  ifStatement:
    /^if\$\(\$?(\$([\s\S]+?)?\$)?\)\$(\{\$?(\$([\s\S]*?)\$)?\})?([\s\S]*?)?$/,
  conditionExpression: /^([\s\S]+?)\$\?\$([\s\S]+?)\$\:\$([\s\S]+?)$/,
  whileStatement:
    /^while\$\(\$?(\$([\s\S]+?)?\$)?\)\$(\{\$?(\$([\s\S]*?)\$)?\})?([\s\S]*?)?$/,
  forStatement:
    /^for\$\(\$?(\$([\s\S]*?)?\$)?\;\$?(\$([\s\S]*?)?\$)?\;\$?(\$([\s\S]*?)?\$)?\$?\)\$(\{\$?(\$([\s\S]*?)\$)?\})?([\s\S]*?)?$/,
  shortHandMethodProperty:
    /\(\$?(\$([\s\S]*?)?\$)?\)\$\{\$?(\$([\s\S]*?)\$)?\}$/,
  classExpression:
    /^class\$([\w]+?\$(extends\$[\s\S]+?\$)?)?\{\$?(\$([\s\S]*?)\$)?\}$/,
  classDeclaration:
    /^class\$[\w]+?\$(extends\$[\s\S]+?\$)?\{\$?(\$([\s\S]*?)\$)?\}$/,
};

export class AST {
  static selectMethod = testingmodule;
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
    const leftFn = leftMethod.bind(this);
    const rightFn = rightMethod.bind(this);
    const left = leftFn(start, end);
    if (left) {
      return callback(left, null);
    }
    for (let i = end; i >= start; i--) {
      const left = leftFn(start, i);
      if (!left) {
        continue;
      }
      const right = rightFn(i + 1, end);
      if (right) {
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

    for (let i = end; i >= start; i--) {
      if (!fn(i)) {
        continue;
      }
      const left = leftFn(start, i - 1);
      if (!left) {
        continue;
      }
      const right = rightFn(i + 1, end);
      if (right) {
        return callback(left, right, i);
      }
    }
    return null;
  }

  getStartEnd(start, end) {
    return {
      start: this.list[start]?.start,
      end: this.list[end]?.end,
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

  isAsterisk(i) {
    return this.list[i]?.value === SIGNS.ASTERISK;
  }

  isBIGGER(i) {
    return this.list[i]?.value === SIGNS.BIGGER;
  }

  isQuestion(i) {
    return this.list[i]?.value === SIGNS.QUESTION;
  }

  isExclamation(i) {
    return this.list[i]?.value === SIGNS.Exclamation;
  }

  isSMALLER(i) {
    return this.list[i]?.value === SIGNS.SMALLER;
  }

  isEqualRight(i) {
    return this.list[i]?.value === SIGNS.EQU + SIGNS.BIGGER;
  }

  isSpreadSign(i) {
    return this.list[i]?.value === SIGNS.DOT + SIGNS.DOT + SIGNS.DOT;
  }

  isAssignSign(i) {
    return assignMathOpetators.includes(this.list[i]?.value) || this.isEqual(i);
  }

  isDeclareKind(i) {
    const item = this.list[i];
    return VariableDeclarationDicts.includes(item?.value);
  }

  isBinaryOperator(i) {
    const item = this.list[i];
    return BinaryOperators.includes(item?.value);
  }

  isLogicalOperator(i) {
    const item = this.list[i];
    return LogicalOperators.includes(item?.value);
  }

  isUnaryOperator(i) {
    const item = this.list[i];
    return UnaryOperators.includes(item?.value);
  }

  isUpdateOperator(i) {
    const item = this.list[i];
    return UpdateOperators.includes(item?.value);
  }

  isAsyncKeyWord(i) {
    return this.list[i]?.value === KEYWORD.ASYNC;
  }

  isFuncKeyWord(i) {
    return this.list[i]?.value === KEYWORD.FUNCTION;
  }

  isIfKeyWord(i) {
    return this.list[i]?.value === KEYWORD.IF;
  }

  isForKeyWord(i) {
    return this.list[i]?.value === KEYWORD.FOR;
  }

  isReturnKeyWord(i) {
    return this.list[i]?.value === KEYWORD.RETURN;
  }

  isElseKeyWord(i) {
    return this.list[i]?.value === KEYWORD.ELSE;
  }

  isWhileKeyWord(i) {
    return this.list[i]?.value === KEYWORD.WHILE;
  }

  isClassKeyWord(i) {
    return this.list[i]?.value === KEYWORD.CLASS;
  }

  isExtendsKeyWord(i) {
    return this.list[i]?.value === KEYWORD.EXTENDS;
  }

  isStaticKeyWord(i) {
    return this.list[i]?.value === KEYWORD.STATIC;
  }

  isAwaitKeyWord(i) {
    return this.list[i]?.value === KEYWORD.AWAIT;
  }

  isNewKeyWord(i) {
    return this.list[i]?.value === KEYWORD.NEW;
  }

  isYieldKeyWord(i) {
    return this.list[i]?.value === KEYWORD.YIELD;
  }

  noSequenceOrHasParenthesis(x, s, e) {
    return (
      !(x && x.type === "SequenceExpression") ||
      (this.isLeftParenthesis(s) && this.isRightParenthesis(e))
    );
  }

  isIdentifier(i) {
    const item = this.list[i] || {};
    if (item.type === DICTS.WORD && !KEYWORDLIST.includes(item.value)) {
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
    const id = this.isIdentifier(start);
    if (end < start + 2 || !id || !this.isEqual(start + 1)) {
      return null;
    }
    const right = this.isExpression(start + 2, end);
    if (right) {
      return {
        type: "AssignmentPattern",
        ...this.getStartEnd(start, end),
        operators: SIGNS.EQU,
        left: id,
        right,
      };
    }
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

  isObjectPropertyNotIdFunctionBody(start, end, isAsync, generator) {
    if (this.isLeftParenthesis(start)) {
      for (let i = start + 1; i <= end; i++) {
        if (!this.isRightParenthesis(i)) {
          continue;
        }
        const params = this.isParams(start + 1, i - 1);
        if (!params) {
          continue;
        }
        const body = this.isBlockStatement(i + 1, end);
        if (body) {
          return {
            type: "FunctionExpression",
            ...this.getStartEnd(start, end),
            id: null,
            expression: false,
            generator,
            async: isAsync,
            params,
            body,
          };
        }
      }
    }
    return null;
  }

  isIdentifierProperty(start, end) {
    if (
      start > end ||
      !this.includesALL(start, end, [
        SIGNS.MIDLeftParenthesis,
        SIGNS.MIDRightParenthesis,
      ])
    ) {
      return null;
    }
    const ss = start;
    let kind = "init";
    let isAsync = false;
    let generator = false;
    if (["set", "get"].includes(this.list[start]?.value)) {
      kind = this.list[start]?.value;
      start++;
    } else {
      if (this.isAsyncKeyWord(start)) {
        isAsync = true;
        start++;
        if (this.isAsterisk(start)) {
          generator = true;
          start++;
        }
      } else if (this.isAsterisk(start)) {
        generator = true;
        start++;
      }
    }
    const first = this.isMidLeftParenthesis(start);
    if (first) {
      for (let i = start + 1; i <= end; i++) {
        if (!this.isMidRightParenthesis(i)) {
          continue;
        }
        const left = this.isExpression(start + 1, i - 1);
        if (!left) {
          continue;
        }
        if (this.isLeftParenthesis(i + 1)) {
          const value = this.isObjectPropertyNotIdFunctionBody(
            i + 1,
            end,
            isAsync,
            generator
          );
          if (value) {
            return {
              type: "Property",
              ...this.getStartEnd(ss, end),
              method: true,
              shorthand: false,
              computed: true,
              key: left,
              kind,
              value,
            };
          }
        }

        if (!this.isCOLON(i + 1)) {
          continue;
        }

        const right = this.isExpression(i + 2, end);
        if (right) {
          return {
            type: "Property",
            ...this.getStartEnd(ss, end),
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
    return null;
  }

  isSpreadElement(start, end) {
    if (start + 1 > end || !this.isSpreadSign(start)) {
      return null;
    }
    const argument =
      (this.isLeftParenthesis(start + 1) &&
        this.isRightParenthesis(end) &&
        this.isExpression(start + 1, end)) ||
      (start + 1 === end && this.isIdentifier(end)) ||
      this.isCallExpression(start + 1, end);
    if (argument) {
      return {
        type: "SpreadElement",
        ...this.getStartEnd(start, end),
        argument,
      };
    }
    return null;
  }

  isShortHandMethodProperty(start, end) {
    if (!this.get(start, end).match(REGS.shortHandMethodProperty)) {
      return null;
    }

    const ss = start;
    let kind = "init";
    let isAsync = false;
    let generator = false;
    if (["set", "get"].includes(this.list[start]?.value)) {
      kind = this.list[start]?.value;
      start++;
    } else {
      if (this.isAsyncKeyWord(start)) {
        isAsync = true;
        start++;
        if (this.isAsterisk(start)) {
          generator = true;
          start++;
        }
      } else if (this.isAsterisk(start)) {
        generator = true;
        start++;
      }
    }

    const id = this.isIdentifier(start);
    if (!id) {
      return null;
    }
    const value = this.isObjectPropertyNotIdFunctionBody(
      start + 1,
      end,
      isAsync,
      generator
    ); // todo
    if (value) {
      return {
        type: "Property",
        ...this.getStartEnd(ss, end),
        method: true,
        shorthand: true,
        computed: false,
        key: id,
        kind,
        value,
      };
    }
  }

  isObjectExpressionProperty(start, end) {
    // 这俩个后续可以抽一下
    return (
      this.isCommonProperty(start, end) ||
      this.isIdentifierProperty(start, end) ||
      this.isSpreadElement(start, end) ||
      this.isShortHandMethodProperty(start, end)
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

  isArrayPatternElementsItem(start, end) {
    return (
      this.isArrayPattern(start, end) ||
      this.isObjectPattern(start, end) ||
      this.isAssignmentPattern(start, end) ||
      (start === end && this.isIdentifier(start)) ||
      this.isSpreadElement(start, end)
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

  isArrayPatternElements(start, end) {
    if (start > end) {
      return [];
    }
    const item = this.isArrayPatternElementsItem(start, end);
    if (item) {
      return [item];
    }
    return this.breakUpBySign(
      start,
      end,
      this.isComma,
      this.isArrayPatternElementsItem,
      this.isArrayPatternElements
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
    return null;
  }

  isArrayPattern(start, end) {
    if (
      start >= end ||
      !this.isMidLeftParenthesis(start) ||
      !this.isMidRightParenthesis(end)
    ) {
      return null;
    }
    if (start + 1 === end) {
      return {
        type: "ArrayPattern",
        ...this.getStartEnd(start, end),
        elements: [],
      };
    }
    const elements = this.isArrayPatternElements(start + 1, end - 1);
    if (elements) {
      return {
        type: "ArrayPattern",
        ...this.getStartEnd(start, end),
        elements,
      };
    }
    return null;
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
    let id = null;
    let next = -1;
    const item = this.isIdentifier(start);
    if (item) {
      id = item;
      next = start + 1;
      if (start === end) {
        return {
          type: "VariableDeclarator",
          ...this.getStartEnd(start, end),
          id,
          init: null,
        };
      }
    } else {
      for (let i = start; i <= end; i++) {
        if (!this.isEqual(i)) {
          continue;
        }
        const temp =
          this.isObjectPattern(start, i - 1) ||
          this.isArrayPattern(start, i - 1);

        if (temp) {
          id = temp;
          next = i;
          break;
        }
      }
    }
    if (!id || !this.isEqual(next)) {
      return null;
    }
    const right = this.isExpression(next + 1, end);
    if (right && this.noSequenceOrHasParenthesis(right, next + 1, end)) {
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

  isClassDeclaration(start, end) {
    return this.isCommonClass(
      start,
      end,
      REGS.classDeclaration,
      "ClassDeclaration"
    );
  }

  isFunctionDeclaration(start, end) {
    return this.isCommonFunction(
      start,
      end,
      REGS.funcDeclaration,
      "FunctionDeclaration"
    );
  }

  isPropertyDefinition(start, end) {
    const ss = start;
    const ee = end;
    let isStatic = this.isStaticKeyWord(start) || false;
    if (isStatic) {
      start++;
    }

    while (this.isSemicolon(end) && start < end) {
      end--;
    }

    const key = this.isIdentifier(start);

    if (start === end) {
      if (key) {
        return {
          type: "PropertyDefinition",
          ...this.getStartEnd(ss, ee),
          static: isStatic,
          computed: false,
          key,
          value: null,
        };
      }
    }

    if (!this.hasSign(start, end, this.isEqual)) {
      return null;
    }

    if (this.isMidLeftParenthesis(start)) {
      for (let i = start + 1; i <= end; i++) {
        if (!this.isMidRightParenthesis(i) || !this.isEqual(i + 1)) {
          continue;
        }
        const key = this.isExpression(start + 1, i - 1);
        if (!key) {
          continue;
        }
        const value = this.isExpression(i + 2, end);
        if (value) {
          return {
            type: "PropertyDefinition",
            ...this.getStartEnd(ss, ee),
            static: isStatic,
            computed: true,
            key,
            value,
          };
        }
      }
    } else if (key && this.isEqual(start + 1)) {
      const value = this.isExpression(start + 2, end);
      if (value) {
        return {
          type: "PropertyDefinition",
          ...this.getStartEnd(ss, ee),
          static: isStatic,
          computed: false,
          key,
          value,
        };
      }
    }
    return null;
  }

  isMethodDefinition(start, end) {
    if (!this.get(start, end).match(REGS.shortHandMethodProperty)) {
      return null;
    }

    const ss = start;
    let isStatic = this.isStaticKeyWord(start) || false;
    if (isStatic) {
      start++;
    }

    while (this.isSemicolon(end) && start < end) {
      end--;
    }

    let kind = "method";
    let isAsync = false;
    let generator = false;
    if (["set", "get"].includes(this.list[start]?.value)) {
      kind = this.list[start]?.value;
      start++;
    } else {
      if (this.isAsyncKeyWord(start)) {
        isAsync = true;
        start++;
        if (this.isAsterisk(start)) {
          generator = true;
          start++;
        }
      } else if (this.isAsterisk(start)) {
        generator = true;
        start++;
      }
    }

    let computed = false;
    let id = this.isIdentifier(start);
    if (!id) {
      const first = this.isMidLeftParenthesis(start);
      if (first) {
        for (let i = start + 1; i <= end; i++) {
          if (!this.isMidRightParenthesis(i)) {
            continue;
          }
          const left = this.isExpression(start + 1, i - 1);
          if (!left) {
            continue;
          }
          computed = true;
          if (this.isLeftParenthesis(i + 1)) {
            const value = this.isObjectPropertyNotIdFunctionBody(
              i + 1,
              end,
              isAsync,
              generator
            );
            if (value) {
              return {
                type: "MethodDefinition",
                ...this.getStartEnd(ss, end),
                static: isStatic,
                computed,
                key: left,
                kind,
                value,
              };
            }
          }
        }
      }
      return null;
    }
    const value = this.isObjectPropertyNotIdFunctionBody(
      start + 1,
      end,
      isAsync,
      generator
    ); // todo
    if (value) {
      return {
        type: "MethodDefinition",
        ...this.getStartEnd(ss, end),
        static: isStatic,
        computed,
        key: id,
        kind,
        value,
      };
    }
  }

  isClassBodyDefinition(start, end) {
    return (
      this.isPropertyDefinition(start, end) ||
      this.isMethodDefinition(start, end)
    );
  }

  isClassBodyContent(start, end) {
    if (start > end) {
      return [];
    }
    return this.rightDfs(
      start,
      end,
      this.isClassBodyDefinition,
      this.isClassBodyContent,
      (left, right) => [left, ...(right ? right : [])]
    );
  }

  isClassBody(start, end) {
    if (!this.isBIGLeftParenthesis(start) || !this.isBIGRightParenthesis(end)) {
      return null;
    }
    const body = this.isClassBodyContent(start + 1, end - 1);
    if (body) {
      return {
        type: "ClassBody",
        ...this.getStartEnd(start, end),
        body,
      };
    }
  }

  // 表达式

  isExpression(start, end) {
    if (start > end) {
      return null;
    }
    return (
      (start === end && (this.isLiteral(start) || this.isIdentifier(start))) ||
      this.isAssignmentExpression(start, end) ||
      this.isYieldExpression(start, end) ||
      this.isClassExpression(start, end) ||
      this.isConditionalExpression(start, end) ||
      this.isUpdateExpression(start, end) ||
      this.isUnaryExpression(start, end) ||
      this.isLogicalExpression(start, end) ||
      this.isObjectExpression(start, end) ||
      this.isBinaryExpression(start, end) ||
      this.isFunctionExpression(start, end) || 
      this.isArrowFunctionExpression(start, end) ||
      this.isAwaitExpression(start, end) ||
      this.isCallExpression(start, end) ||
      this.isMemberExpression(start, end) ||
      this.isNewExpression(start, end) ||
      this.isArrayExpression(start, end) ||
      this.isSequenceExpression(start, end) ||
      (this.isLeftParenthesis(start) &&
        this.isRightParenthesis(end) &&
        this.isExpression(start + 1, end - 1))
    );
  }

  isYieldExpression(start, end) {
    if (!this.isYieldKeyWord(start)) {
      return null;
    }
    while (this.isSemicolon(end) && start < end) {
      end = end - 1;
    }

    const argument = this.isExpression(start + 1, end);
    if (argument || start === end) {
      return {
        type: "YieldExpression",
        ...this.getStartEnd(start, end),
        argument,
      };
    }
  }

  isCommonClass(start, end, regp, type) {
    if (!this.isClassKeyWord(start) || !this.get(start, end).match(regp)) {
      return null;
    }
    const ss = start;
    const id = this.isIdentifier(start + 1);
    let next = start + 1;
    if (id) {
      next = start + 2;
    }

    if (id && this.isExtendsKeyWord(next)) {
      for (let i = next + 1; i <= end; i++) {
        if (!this.isBIGLeftParenthesis(i)) {
          continue;
        }
        const superClass = this.isExpression(next + 1, i - 1);
        if (!superClass) {
          continue;
        }
        const body = this.isClassBody(i, end);
        if (body) {
          return {
            type,
            ...this.getStartEnd(ss, end),
            id,
            superClass,
            body,
          };
        }
      }
    } else if (this.isBIGLeftParenthesis(next)) {
      const body = this.isClassBody(next, end);
      if (body) {
        return {
          type,
          ...this.getStartEnd(ss, end),
          id,
          superClass: null,
          body,
        };
      }
    }
    return null;
  }

  isClassExpression(start, end) {
    return this.isCommonClass(
      start,
      end,
      REGS.classExpression,
      "ClassExpression"
    );
  }

  isSequenceExpression(start, end) {
    if (!this.hasSign(start, end, this.isComma)) {
      return null;
    }

    for (let i = start; i <= end; i++) {
      if (!this.isComma(i)) {
        continue;
      }
      const left = this.isExpression(start, i - 1);
      if (!left) {
        continue;
      }
      const right = this.isExpression(i + 1, end);
      if (right) {
        return {
          type: "SequenceExpression",
          ...this.getStartEnd(start, end),
          expressions: [
            left,
            ...(right.type === "SequenceExpression"
              ? right.expressions
              : [right]),
          ],
        };
      }
    }
  }

  isUpdateExpression(start, end) {
    if (!(this.isUpdateOperator(start) || this.isUpdateOperator(end))) {
      return null;
    }
    if (this.isUpdateOperator(start)) {
      const argument = this.isExpression(start + 1, end);
      if (argument) {
        return {
          type: "UpdateExpression",
          ...this.getStartEnd(start, end),
          operator: this.list[start].value,
          prefix: true,
          argument,
        };
      }
    } else if (this.isUpdateOperator(end)) {
      const argument = this.isExpression(start, end - 1);
      if (argument) {
        return {
          type: "UpdateExpression",
          ...this.getStartEnd(start, end),
          operator: this.list[end].value,
          prefix: false,
          argument,
        };
      }
    }
    return null;
  }

  isUnaryExpression(start, end) {
    if (!this.isUnaryOperator(start)) {
      return null;
    }
    const argument = this.isExpression(start + 1, end);
    if (argument) {
      return {
        type: "UnaryExpression",
        ...this.getStartEnd(start, end),
        operator: this.list[start].value,
        prefix: true, // todo 应该有后坠
        argument,
      };
    }
  }

  isLogicalExpression(start, end) {
    if (end < start + 2) {
      return null;
    }

    return this.breakUpBySign(
      start,
      end,
      this.isLogicalOperator,
      this.isExpression,
      this.isExpression,
      (left, right, i) => ({
        type: "LogicalExpression",
        ...this.getStartEnd(start, end),
        left,
        right,
        operator: this.list[i].value,
      })
    );
  }

  isConditionalExpression(start, end) {
    if (!this.get(start, end).match(REGS.conditionExpression)) {
      return null;
    }
    for (let i = start; i <= end; i++) {
      if (!this.isQuestion(i)) {
        continue;
      }
      const test = this.isExpression(start, i - 1);
      if (!test) {
        continue;
      }
      for (let j = i + 1; j <= end; j++) {
        if (!this.isCOLON(j)) {
          continue;
        }
        const consequent = this.isExpression(i + 1, j - 1);
        if (!consequent) {
          continue;
        }
        const alternate = this.isExpression(j + 1, end);
        if (alternate) {
          return {
            type: "ConditionalExpression",
            ...this.getStartEnd(start, end),
            test,
            consequent,
            alternate,
          };
        }
      }
    }
    return null;
  }

  isBinaryExpression(start, end) {
    if (end < start + 2) {
      return null;
    }
    return this.breakUpBySign(
      start,
      end,
      this.isBinaryOperator,
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
        if (!params) {
          continue;
        }
        const body = this.isBlockStatement(i + 1, end);
        if (body) {
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
      (this.isAsyncKeyWord(start) &&
        this.isFuncKeyWord(start + 1) &&
        fn(start, true)) ||
      (this.isFuncKeyWord(start) && fn(start - 1, false))
    );
  }

  isFunctionExpression(start, end) {
    return this.isCommonFunction(
      start,
      end,
      REGS.funcExpression,
      "FunctionExpression"
    );
  }

  isCallExpression(start, end) {
    if (
      !this.get(start, end).match(REGS.callExpression) ||
      !this.isRightParenthesis(end)
    ) {
      return null;
    }
    const ee = end;
    const fn = (end, args, optional) => {
      const callee = this.isExpression(start, end);
      if (callee && args) {
        return {
          type: "CallExpression",
          ...this.getStartEnd(start, ee),
          callee,
          arguments: args,
          optional,
        };
      }
    };

    for (let i = end; i >= start; i--) {
      if (!this.isLeftParenthesis(i)) {
        continue;
      }
      const args = this.isElements(i + 1, end - 1);
      if (!args) {
        continue;
      }
      const ret =
        (this.isDot(i - 1) &&
          this.isQuestion(i - 2) &&
          fn(i - 3, args, true)) ||
        fn(i - 1, args, false);
      if (ret) {
        return ret;
      }
    }
    return null;
  }

  isAssignmentExpression(start, end) {
    if (end < start + 2 || !this.hasSign(start, end, this.isAssignSign)) {
      return null;
    }
    let id = null;
    let next = -1;
    for (let i = start; i <= end; i++) {
      if (!this.isAssignSign(i)) {
        continue;
      }
      const temp =
        this.isMemberExpression(start, i - 1) ||
        (start === i - 1 && this.isIdentifier(start));
      if (temp) {
        (id = temp), (next = i);
        break;
      }
    }

    if (!id || !this.isAssignSign(next)) {
      return null;
    }

    const right = this.isExpression(next + 1, end);
    if (right) {
      return {
        type: "AssignmentExpression",
        ...this.getStartEnd(start, end),
        operators: this.list[next]?.value, // todo 封装
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

  isMemberExpression(start, end) {
    if (!this.get(start, end).match(REGS.memberExpression)) {
      return null;
    }
    const ee = end;
    const fn = (end, property, optional, computed) => {
      const object = this.isExpression(start, end);
      if (property && object) {
        return {
          type: "MemberExpression",
          ...this.getStartEnd(start, end),
          object,
          property,
          optional,
          computed,
        };
      }
    };
    if (this.isMidRightParenthesis(end)) {
      // [ ]
      for (let i = end; i >= start; i--) {
        if (!this.isMidLeftParenthesis(i)) {
          continue;
        }
        const property = this.isExpression(i + 1, end - 1);
        if (!property) {
          continue;
        }
        const ret =
          (this.isDot(i - 1) &&
            this.isQuestion(i - 2) &&
            fn(i - 3, property, true, true)) ||
          fn(i - 1, property, false, true);
        if (ret) {
          return ret;
        }
      }
      return null;
    } else {
      const property = this.isIdentifier(end);
      if (!property || !this.isDot(end - 1)) {
        return null;
      }
      return (
        (this.isQuestion(end - 2) && fn(end - 3, property, true, false)) ||
        fn(end - 2, property, false, false)
      );
    }
  }

  isArrowFunctionExpression(start, end) {
    if (!this.get(start, end).match(REGS.arrowFuncExpression)) {
      return null;
    }
    const ss = start;
    const handleBody = (params, i, isAsync) => {
      if (this.isBIGLeftParenthesis(i) && this.isBIGRightParenthesis(end)) {
        const body = this.isBlockStatement(i, end);
        if (params && body) {
          return {
            type: "ArrowFunctionExpression",
            ...this.getStartEnd(ss, end),
            id: null,
            expression: false,
            generator: false,
            async: isAsync,
            params,
            body,
          };
        }
      }
      const body = this.isExpression(i, end);
      const isObject = this.isObjectExpression(i, end);
      if (params && body && !isObject) {
        return {
          type: "ArrowFunctionExpression",
          ...this.getStartEnd(ss, end),
          id: null,
          expression: true,
          generator: false,
          async: isAsync,
          params,
          body,
        };
      }
      return null;
    };
    const fn = (start, isAsync) => {
      if (this.isLeftParenthesis(start)) {
        for (let i = start; i <= end; i++) {
          if (!this.isRightParenthesis(i) || !this.isEqualRight(i + 1)) {
            continue;
          }
          const params = this.isParams(start + 1, i - 1);
          if (!params) {
            continue;
          }
          const t = handleBody(params, i + 2, isAsync);
          if (t) {
            return t;
          }
        }
      } else if (this.isIdentifier(start)) {
        const params = [this.isIdentifier(start)];
        if (!this.isEqualRight(start + 1)) {
          return null;
        }
        return handleBody(params, start + 2, isAsync);
      }
    };

    return (
      (this.isAsyncKeyWord(start) && fn(start + 1, true)) || fn(start, false)
    );
  }

  isNewExpression(start, end) {
    if (!this.isNewKeyWord(start)) {
      return null;
    }
    while (this.isSemicolon(end) && start < end) {
      end = end - 1;
    }

    const callExpression = this.isCallExpression(start + 1, end);

    if (callExpression) {
      return {
        type: "NewExpression",
        ...this.getStartEnd(start, end),
        callee:  callExpression.callee,
        arguments: callExpression.arguments,
      };
    }
  }

  isElements(start, end) {
    if (start > end) {
      return [];
    }
    const expression = this.isExpression(start, end);
    if (expression && this.noSequenceOrHasParenthesis(expression, start, end)) {
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

  isAwaitExpression(start, end) {
    if (!this.isAwaitKeyWord(start)) {
      return null;
    }
    while (this.isSemicolon(end) && start < end) {
      end = end - 1;
    }

    const argument = this.isExpression(start + 1, end);
    if (argument) {
      return {
        type: "AwaitExpression",
        ...this.getStartEnd(start, end),
        argument,
      };
    }
  }

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

  isExpressionStatement(start, end) {
    const expression = this.isExpression(start, end);
    if (expression) {
      return {
        type: "ExpressionStatement",
        ...this.getStartEnd(start, end),
        expression,
      };
    }
  }

  isForStatement(start, end) {
    if (
      !this.isForKeyWord(start) ||
      !this.isLeftParenthesis(start + 1) ||
      this.isRightParenthesis(start + 2) ||
      !this.get(start, end).match(REGS.forStatement)
    ) {
      return null;
    }
    for (let i = start + 2; i <= end; i++) {
      if (!this.isSemicolon(i)) {
        continue;
      }
      const init =
        this.isVariableDeclaration(start + 2, i - 1) ||
        this.isExpression(start + 2, i - 1);
      if (!init && i !== start + 2) {
        continue;
      }
      for (let j = i + 1; j <= end; j++) {
        if (!this.isSemicolon(j)) {
          continue;
        }
        const test = this.isExpression(i + 1, j - 1);
        if (!test && j !== i + 1) {
          continue;
        }
        for (let k = j + 1; k <= end; k++) {
          if (!this.isRightParenthesis(k)) {
            continue;
          }
          const update = this.isExpression(j + 1, k - 1);
          if (!update && k !== j + 1) {
            continue;
          }
          const body =
            this.isBlockStatement(k + 1, end) ||
            this.isExpressionStatement(k + 1, end);
          if (body) {
            return {
              type: "ForStatement",
              ...this.getStartEnd(start, end),
              init,
              test,
              update,
              body,
            };
          }
        }
      }
    }

    return null;
  }

  isIfStatement(start, end) {
    if (
      !this.isIfKeyWord(start) ||
      !this.isLeftParenthesis(start + 1) ||
      this.isRightParenthesis(start + 2) ||
      !this.get(start, end).match(REGS.ifStatement)
    ) {
      return null;
    }

    for (let i = start + 2; i <= end; i++) {
      if (!this.isRightParenthesis(i)) {
        continue;
      }
      const test = this.isExpression(start + 2, i - 1);

      if (!test) {
        continue;
      }

      let consequent;
      let alternate = null;
      if (!this.hasSign(start, end, this.isElseKeyWord)) {
        consequent =
          this.isBlockStatement(i + 1, end) ||
          this.isExpressionStatement(i + 1, end);

        if (consequent) {
          return {
            type: "IfStatement",
            ...this.getStartEnd(start, end),
            test,
            consequent,
            alternate,
          };
        }
      } else {
        for (let j = i + 1; j <= end; j++) {
          if (!this.isElseKeyWord(j)) {
            continue;
          }
          consequent =
            this.isBlockStatement(i + 1, j - 1) ||
            this.isExpressionStatement(i + 1, j - 1);
          if (!consequent) {
            continue;
          }
          alternate =
            this.isBlockStatement(j + 1, end) ||
            this.isExpressionStatement(j + 1, end) ||
            this.isIfStatement(j + 1, end);
          if (alternate) {
            return {
              type: "IfStatement",
              ...this.getStartEnd(start, end),
              test,
              consequent,
              alternate,
            };
          }
        }
        return null;
      }
    }
    return null;
  }

  isWhileStatement(start, end) {
    if (
      start + 3 > end ||
      !this.get(start, end).match(REGS.whileStatement) ||
      !this.isWhileKeyWord(start) ||
      !this.isLeftParenthesis(start + 1) ||
      this.isRightParenthesis(start + 2)
    ) {
      return null;
    }
    for (let i = start + 2; i <= end; i++) {
      if (!this.isRightParenthesis(i)) {
        continue;
      }
      const test = this.isExpression(start + 2, i - 1);

      if (!test) {
        continue;
      }

      const body =
        this.isBlockStatement(i + 1, end) ||
        this.isExpressionStatement(i + 1, end);
      if (body) {
        return {
          type: "WhileStatement",
          ...this.getStartEnd(start, end),
          test,
          body,
        };
      }
    }
    return null;
  }

  isBlockStatementBody(start, end) {
    if (start > end) {
      return [];
    }
    return this.rightDfs(
      start,
      end,
      this.isDeclarationOrStatement,
      this.isBlockStatementBody,
      (left, right) => [left, ...(right ? right : [])]
    );
  }

  isBlockStatement(start, end) {
    if (!this.isBIGLeftParenthesis(start) || !this.isBIGRightParenthesis(end)) {
      return null;
    }
    const body = this.isBlockStatementBody(start + 1, end - 1);
    if (body) {
      return {
        type: "BlockStatement",
        ...this.getStartEnd(start, end),
        body,
      };
    }
    return null;
  }

  isReturnStatement(start, end) {
    if (!this.isReturnKeyWord(start)) {
      return null;
    }
    while (this.isSemicolon(end) && start < end) {
      end = end - 1;
    }

    const argument = this.isExpression(start + 1, end);
    if (argument || start === end) {
      return {
        type: "ReturnStatement",
        ...this.getStartEnd(start, end),
        argument,
      };
    }
  }

  isStatement(start, end) {
    return (
      this.isEmptyStatement(start, end) ||
      this.isReturnStatement(start, end) ||
      this.isBlockStatement(start, end) ||
      this.isExpressionStatement(start, end) ||
      this.isIfStatement(start, end) ||
      this.isForStatement(start, end) ||
      this.isWhileStatement(start, end)
    );
  }

  isDeclaration(start, end) {
    return (
      this.isVariableDeclaration(start, end) ||
      this.isFunctionDeclaration(start, end) ||
      this.isClassDeclaration(start, end)
    );
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
    return this.rightDfs(
      start,
      end,
      this.isDeclarationOrStatement,
      this.isProgram,
      (left, right) => ({
        type: "Program",
        ...this.getStartEnd(start, end),
        body: [left, ...(right ? right.body : [])],
        sourceType: "module",
      })
    );
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
