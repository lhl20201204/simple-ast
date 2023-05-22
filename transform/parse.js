export default function parse(str) {
  const len = (str || "").length;
  let i = 0;
  let col = 1;
  let row = 1;
  let lastI = -1;
  let lastRowI = -1;
  const wordList = [];

  const mulSigns = [
    "=>",
    "...",
    "+=",
    "-=",
    "*=",
    "/=",
    "!=",
    "!==",
    "==",
    "===",
    ">=",
    "<=",
    "&&",
    "||",
    '++',
    '--',
    '>>>',
    '<<',
    '>>',
    '%=',
    '<<=',
    '>>=',
    '>>>=',
    '&=',
    '^=',
    '|='
  ].sort((a, b) => b.length - a.length);

  function next() {
    i++;
    col++;
  }

  function isNoEnd() {
    return i < len;
  }

  function isSpace(c) {
    return (c || str[i]) === " ";
  }

  function isNewLine(c) {
    const ret = (c || str[i]) === "\n";
    if (ret && lastRowI !== i) {
      lastRowI = i;
      row++;
      col = 0;
    }
    return ret;
  }

  function isChar(c) {
    return (c || str[i]).match(/[a-zA-Z]/);
  }

  function isNumber(c) {
    return (c || str[i]).match(/[0-9]/);
  }

  function isPoint(c) {
    return (c || str[i]) === ".";
  }

  function isUnderLine(c) {
    return (c || str[i]) === "_";
  }

  function isSlant(c) {
    return (c || str[i]) === "/";
  }

  function isAsterisk(c) {
    return (c || str[i]) === "*";
  }

  function isSingleQuotationMark(c) {
    return (c || str[i]) === "'";
  }

  function isDoubleQuotationMark(c) {
    return (c || str[i]) === '"';
  }

  function isAntiQuotationMark(c) {
    return (c || str[i]) === "`";
  }

  function isDot(c) {
    return (c || str[i]) === ".";
  }

  function isNoCharOrNumber(c) {
    return !isChar(c) && !isNumber(c);
  }

  function isSpaceOrIsNewLine(c) {
    return isSpace(c) || isNewLine(c);
  }

  function checkError() {
    if (i === lastI) {
      throw new Error();
    }
    lastI = i;
  }

  function checkSpaceOrIsNewLine() {
    if (isSpaceOrIsNewLine()) {
      next();
    }
  }

  function isWord() {
    return isChar() || isUnderLine() || isNumber();
  }

  function isNum() {
    return isPoint() || isNumber();
  }

  function checkRemark() {
    const ret = [];
    const startCol = col;
    const startRow = row;
    let endCol = null;
    let endRow = null;
    const start = i;

    if (isSlant(str[i]) && isSlant(str[i + 1])) {
      while (isNoEnd() && !isNewLine()) {
        ret.push(str[i]);
        endCol = col;
        next();
      }
      endRow = row - 1;
    } else if (isSlant(str[i]) && isAsterisk(str[i + 1])) {
      while (
        isNoEnd() &&
        (!(isAsterisk(str[i - 2]) && isSlant(str[i - 1])) || i - 2 <= start + 1)
      ) {
        isNewLine(); // 让row 自动加加
        ret.push(str[i]);
        next();
      }
      if (!(isAsterisk(str[i - 2]) && isSlant(str[i - 1]))) {
        throw new Error();
      }
      endCol = col - 1;
      endRow = row;
    }

    if (ret.length) {
      wordList.push({
        type: "remark",
        start,
        end: i,
        startCol,
        endCol,
        startRow,
        endRow,
        value: ret.join(""),
      });
    }
  }

  function checkWord() {
    const ret = [];
    const startCol = col;
    const startRow = row;
    const start = i;
    while (!isSpaceOrIsNewLine() && isNoEnd() && isWord()) {
      ret.push(str[i]);
      next();
    }
    if (ret.length) {
      wordList.push({
        type: "word",
        start,
        end: i,
        startCol,
        endCol: col - 1,
        startRow,
        endRow: row,
        value: ret.join(""),
      });
    }
  }

  function checkString() {
    const ret = [];
    const startCol = col;
    const startRow = row;
    let endCol = null;
    let endRow = null;
    const start = i;

    if (isSingleQuotationMark()) {
      while (
        isNoEnd() &&
        (!isSingleQuotationMark(str[i - 1]) || i - 1 === start)
      ) {
        ret.push(str[i]);
        endCol = col;
        next();
      }
      if (!isSingleQuotationMark(str[i - 1])) {
        throw new Error();
      }
      endRow = row;
    } else if (isDoubleQuotationMark()) {
      while (
        isNoEnd() &&
        (!isDoubleQuotationMark(str[i - 1]) || i - 1 === start)
      ) {
        ret.push(str[i]);
        endCol = col;
        next();
      }
      if (!isDoubleQuotationMark(str[i - 1])) {
        throw new Error();
      }
      endRow = row;
    } else if (isAntiQuotationMark()) {
      while (
        isNoEnd() &&
        (!isAntiQuotationMark(str[i - 1]) || i - 1 === start)
      ) {
        isNewLine(); // 让row 自动加加
        ret.push(str[i]);
        next();
      }
      if (!isAntiQuotationMark(str[i - 1])) {
        throw new Error();
      }
      endCol = col - 1;
      endRow = row;
    }

    if (ret.length) {
      wordList.push({
        type: "string",
        start,
        end: i,
        startCol,
        endCol,
        startRow,
        endRow,
        value: ret.join(""),
      });
    }
  }

  function checkNum() {
    const ret = [];
    const startCol = col;
    const startRow = row;
    const start = i;
    let dot = 0;
    let sub = 0;
    let add = 0;
    while (
      !isSpaceOrIsNewLine() &&
      isNoEnd() &&
      (isNumber() || (isDot() && dot <= 1 && isNumber(str[i - 1])))
    ) {
      //todo 还有正负数需要处理，以后再加
      if (isDot()) {
        dot++;
      }
      ret.push(str[i]);
      next();
    }
    if (dot > 1) {
      throw new Error();
    }
    if (ret.length) {
      wordList.push({
        type: "number",
        start,
        end: i,
        startCol,
        endCol: col - 1,
        startRow,
        endRow: row,
        value: ret.join(""),
      });
    }
  }

  function checkNoCharOrNumber() {
    const ret = [];
    const startCol = col;
    const startRow = row;
    const start = i;
    let flag = false;
    mulSigns.forEach((x) => {
      const len = x.length;
      if (str.slice(i, i + len) === x) {
        flag = true;
        new Array(len).fill(0).forEach((x) => {
          ret.push(str[i]);
          next();
        });
      }
    });

    if (!flag && !isSpaceOrIsNewLine() && isNoEnd() && isNoCharOrNumber()) {
      ret.push(str[i]);
      next();
    }
    if (ret.length) {
      wordList.push({
        type: "sign",
        start,
        end: i - 1,
        startCol,
        endCol: col - 1,
        startRow,
        endRow: row,
        value: ret.join(""),
      });
    }
  }

  try {
    while (isNoEnd()) {
      checkError();
      checkSpaceOrIsNewLine();
      checkRemark();
      checkNum();
      checkWord();
      checkString();
      checkNoCharOrNumber();
    }
    return wordList;
  } catch (e) {
    console.error(e);
    return new Error();
  }
}
