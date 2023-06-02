export default function parse(str) {
  const len = (str || "").length;
  let i = 0;
  let col = 1;
  let row = 1;
  let lastI = -1;
  let lastRowI = -1;
  let rightBraceStack = [];
  let isInTemplate = false;

  function getTopRightBrace() {
    return rightBraceStack[rightBraceStack.length-1]
  }

  function addTopRightBrace() {
    rightBraceStack[rightBraceStack.length-1]++
  }

  function subTopRightBrace() {
    rightBraceStack[rightBraceStack.length-1]--
  }

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

  function getTopWord() {
    return wordList[wordList.length - 1]
  }

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

  function isSlash(c) {
    return (c || str[i]) === `\\`;
  }

  function isDollar(c) {
    return (c || str[i]) === '$';
  }

  function isLeftBrace(c) {
    return (c || str[i]) === '{';
  }

  function isRightBrace(c) {
    return (c || str[i]) === '}';
  }

  function isDot(c) {
    return (c || str[i]) === ".";
  }

  function isQuestion(c) {
    return (c || str[i]) === "?";
  }

  function isNoCharOrNumber(c) {
    return !isChar(c) && !isNumber(c);
  }

  function isSpaceOrIsNewLine(c) {
    return isSpace(c) || isNewLine(c);
  }

  function isLeftBracket(c) {
    return (c || str[i]) === "[";
  }

  function isRightBracket(c) {
    return (c || str[i]) === "]";
  }

  function isLeftParenthesis(c) {
    return (c || str[i]) === "(";
  }

  function isRightParenthesis(c) {
    return (c || str[i]) === ")";
  }

  function isCaret(c) {
    return (c || str[i]) === "^";
  }


  function isSingleRightBrace(tempI = i) {
    return isRightBrace(str[tempI]) && !isSlash(str[tempI-1])
  }

  function isSingleLeftBrace(tempI = i) {
    return isLeftBrace(str[tempI]) && !isSlash(str[tempI-1])
  }

  function isSingleSlant(tempI =i) {
    return isSlant(str[tempI]) && !isSlash(str[tempI-1])
  }

  function isSingleLeftBracket(tempI =i) {
    return isLeftBracket(str[tempI]) && !isSlash(str[tempI-1])
  }

  function isSingelRightBraceket(tempI =i) {
    return isRightBracket(str[tempI]) && !isSlash(str[tempI-1])
  }

  function isSingelLeftParenthesis(tempI = i) {
    return isLeftParenthesis(str[tempI]) && !isSlash(str[tempI-1])
  }

  function isSingelRightParenthesis(tempI = i) {
    return isRightParenthesis(str[tempI]) && !isSlash(str[tempI-1])
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
    let startCol = col;
    let startRow = row;
    let endCol = null;
    let endRow = null;
    let start = i;
    let slashCount = 0;
    if (isSingleQuotationMark()) {
      // '
      while (
        isNoEnd() &&
        ( i - 1 === start 
          || !isSingleQuotationMark(str[i-1])
          || (i-2> start && isSlash(str[i-2]) && slashCount===0)
        )
      ) {
        if (isSlash() && (slashCount % 2 === 0)) {
          slashCount++
        } else if (isSlash(str[i-1]) && ((slashCount % 2 === 1) || isSingleQuotationMark())) {
          slashCount--
        }
        ret.push(str[i]);
        // console.log(ret);
        endCol = col;
        next();
      }
      // console.log('----',str[i-1], '---');
      if (!isSingleQuotationMark(str[i - 1])) {
        throw new Error('缺少\'符号');
      }
      endRow = row;
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
    } else if (isDoubleQuotationMark()) {
      // "
      while (
        isNoEnd() &&
        (i - 1 === start 
        ||  !isDoubleQuotationMark(str[i - 1])
        || (i-2> start && isSlash(str[i-2]) && slashCount===0)
        )
      ) {
        if (isSlash() && (slashCount % 2 === 0)) {
          slashCount++
        } else if (isSlash(str[i-1]) && ((slashCount % 2 === 1) || isDoubleQuotationMark())) {
          slashCount--
        }
        ret.push(str[i]);
        // console.log(ret)
        endCol = col;
        next();
      }
      if (!isDoubleQuotationMark(str[i - 1])) {
        throw new Error('缺少\"符号');
      }
      endRow = row;
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
    } else if (isAntiQuotationMark()) {
      // `  开始验证反斜杆
      // 是否在 ${ }里面
      // 递归处理，括号内的表达式
      // let isInTemplate = 0;
      // let antiCount = 1;
      // 进入嵌套循环时应该匹配的是当前层的右括号
      let flag = false;
      while (
        isNoEnd() &&
        (i - 1 === start 
        || !isAntiQuotationMark(str[i - 1])
        || (i-2> start && isSlash(str[i-2]) && slashCount===0))
      ) {
        isNewLine(); // 让row 自动加加
        if (isSlash() && (slashCount % 2 === 0)) {
          slashCount++
        } else if (isSlash(str[i-1]) && ((slashCount % 2 === 1) || isAntiQuotationMark())) {
          slashCount--
        }
        ret.push(str[i]);
        // console.log(str[i])
        
        // ${
        if (!isSlash(str[i-2]) && isDollar(str[i-1]) && isLeftBrace()) {
          flag = true;
          // 如果有嵌套
          wordList.push({
            type: isRightBrace(ret[0]) ? "templateBody" : "templateHead",
            start,
            end: i,
            startCol,
            endCol,
            startRow,
            endRow,
            value: ret.join(""),
          });
          next()
          endCol = col - 1;
          endRow = row;
          start = i;
          startCol = endCol;
          startRow = endRow;
          ret.splice(0, ret.length);
          rightBraceStack.push(1)
          const preIsInTemplate = isInTemplate
          isInTemplate = true;
          while(isNoEnd() && (!(isSingleRightBrace() && getTopRightBrace()=== 0))) {
            if (check()) {
              break;
            }
          }
          isInTemplate = preIsInTemplate;
          rightBraceStack.pop()
          // }
          // console.log(str[i])
          if(!isRightBrace()){
            throw new Error('缺少}符号');
          }
          ret.push(str[i]);
        } 
      
        next();
      }
      if (!isAntiQuotationMark(str[i - 1])) {
        console.log([...wordList], ret)
        throw new Error('缺少`符号');
      }
      endCol = col - 1;
      endRow = row;
      if (ret.length) {
        wordList.push({
          type: flag ? "templateTail" : 'template',
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
        value: Number(ret.join("")),
      });
    }
  }

  function checkRegx() {
    const ret = [];
    const startCol = col;
    const startRow = row;
    const start = i;
    // todo
    const topWord = getTopWord()
    if (isSlant() && ((topWord.type === 'sign' 
      && !isRightParenthesis(topWord.value)
      && !isRightBrace(topWord.value)
      && !isRightBracket(topWord.value)) || wordList.length === 0)) {
      ret.push(str[i]);
      next()
      let quit = false;
      while(isNoEnd() && !isSingleSlant()) {
        ret.push(str[i]);
        next()
      }
      if (!isSlant() || isSlant(str[i+1])) {
        quit = true;     
      } else {
        ret.push(str[i]);
        next()
        function getI() {
          if (str[i] === 'i') {
            ret.push(str[i])
            next()
          } 
        }
  
        function getG(){
          if (str[i] === 'i') {
            ret.push(str[i])
            next()
          }
        }
        if (str[i] === 'i') {
          getI()
          getG()
        } else if (str[i] === 'g') {
          getG()
          getI()
        }
      }

      try {
        // todo 过于复杂先暂时这样
       if (!quit) {
        new RegExp(ret.join(''));
       if (ret.length) {
        wordList.push({
          type: "regx",
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
      }catch(exception) {
        quit = true;
      }

      if (quit) {
        i = start;
      }
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
      if (isInTemplate) {
        if (isSingleRightBrace()) {
          subTopRightBrace()
          // console.log('sub', getTopRightBrace(), str.slice(i))
          if (getTopRightBrace() === 0) {
            // console.log('tuichu', str.slice(i))
            return true;
          }
        } else if (isSingleLeftBrace()) {
          addTopRightBrace()
          // console.log('add', getTopRightBrace(), str.slice(i))
        }
      }
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
      return false;
    }
  }

  function check() {
    checkError();
    checkSpaceOrIsNewLine();
    checkRemark();
    checkNum();
    checkWord();
    checkString();
    checkRegx();
    checkNoCharOrNumber();
  }

  try {
    while (isNoEnd()) {
      check(0)
    }
    return wordList;
  } catch (e) {
    console.error(e);
    return new Error(e);
  }
}
