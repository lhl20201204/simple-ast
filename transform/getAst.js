import parse from "./parse";

const DICTS = {
  WORD: "word",
  SIGN: "sign",
  NUMBER: "number",
  REMARK: "remark",
  STRING: "string",
};

const VariableDeclarationDicts = ["var", "let", "const"];

const operators = ["+", "-", "*", "/"];

class AST {
  constructor(list) {
    this.list = list;
  }

  get(start, end) {
    return this.list.slice(start, end + 1).map((x) => x.value).join('');
  }

  log(start, end, ...args) {
    console.log(this.get(start, end), ...args);
  }

  getStartEnd(start, end) {
    return {
      start: this.list[start].start,
      end: this.list[end].end,
    };
  }

  isEqual(i) {
    return this.list[i].value === "=";
  }

  isComma(i) {
    return this.list[i].value === ",";
  }

  isLeftParenthesis(i) {
    return this.list[i].value === "(";
  }

  isRightParenthesis(i) {
    return this.list[i].value === ")";
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

  isAssignmentPattern(start, end) {}

  // 声明

  isVariableDeclarator(start, end) {
    const id = this.isIdentifier(start);
    if (end < start + 2 || !id || !this.isEqual(start + 1)) {
      return null;
    }
    const right = this.isExpression(start + 2, end)
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
    return (
      (start === end && (this.isLiteral(start) || this.isIdentifier(start))) ||
      this.isAssignmentExpression(start, end) ||
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

  isFunctionExpression(start, end) {}

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
        operators: '=',
        left: id,
        right,
      };
    }
  }

  isMemberExpression(start, end) {}

  isArrowFunctionExpression(start, end) {}

  isNewExpression(start, end) {}

  isArrayExpression(start, end) {}

  isAwaitExpression(start, end) {}

  // 语句
  isExpressionStatement(start, end) {}

  isForStatement(start, end) {}

  isIfStatement(start, end) {}

  isBlockStatement(start, end) {}

  isStatement(start, end) {
    return null;
  }

  isDeclaration(start, end) {
    return this.isVariableDeclaration(start, end);
  }

  isDeclarationOrStatement(start, end) {
    return this.isDeclaration(start, end) || this.isStatement(start, end) ;
  }

  isProgram(start, end) {
    if (start >= end) {
      return {
        body: []
      }
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
    const tree = ast.isProgram(0, list.length - 1);
    console.log('tree', tree, wordList)
    if (!tree) {
      return new Error()
    }

    const writeJSON = (obj, prefix, name) => {
      const ret = []; 
      const prefixSpace = new Array(prefix).fill(0)
          .map((v) => " ")
          .join("");
    
      for (const attr in obj) {
          const t = obj[attr]
        if (t instanceof Object) {
          const child = writeJSON(t, prefix + 2, attr);  
          ret.push(prefixSpace + `${(attr * 1 == attr) ? '' : attr + ': '}` +  `${Array.isArray(t) ? '[' : '{'}\n`)
          ret.push(...child.join(""));
          ret.push(prefixSpace + `${Array.isArray(t) ? '],' : '},'}\n`)
        } else {
          ret.push(prefixSpace + attr + ": " + (typeof t === 'number' ? t : "\"" + t + "\"") + ",\n");
        }
      }
      return ret;
    };
    return "{\n" + writeJSON(tree, 2).join("") + "}" ;
  } catch (e) {
    return new Error();
  }
}
