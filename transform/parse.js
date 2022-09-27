export default function parse(str) {
  const len = (str || "").length;
  let i = 0;
  let lastI = -1;
  const wordList = [];

  function checkPush(x) {
    if (!x) {
      return;
    }
    wordList.push(x);
  }

  function next() {
    i++;
  }

  function isNoEnd() {
    return i < len;
  }

  function isSpace(c) {
    return (c || str[i]) === " ";
  }

  function isNewLine(c) {
    return (c || str[i]) === "\n";
  }

  function isChar(c) {
    return (c || str[i]).match(/[a-z|A-Z]/);
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

  }
  
 

  function checkWord() {
    const ret = [];
    while (!isSpaceOrIsNewLine() && isNoEnd() && isWord()) {
      ret.push(str[i]);
      next();
    }
    checkPush(ret.length ? {
      type: 'word',
      value: ret.join('')
    } : null);
  }

  

  function checkNum() {
    const ret = [];
    while (!isSpaceOrIsNewLine() && isNoEnd() && isNum()) {
      ret.push(str[i]);
      next();
    }
    checkPush(ret.length ? {
      type: 'number',
      value: ret.join('')
    } : null);
  }

  function checkNoCharOrNumber() {
    const ret = [];
    if (!isSpaceOrIsNewLine() && isNoEnd() && isNoCharOrNumber()) {
      ret.push(str[i]);
      next();
    }
    checkPush(ret.length ? {
      type: 'sign',
      value: ret.join('')
    } : null);
  }

  while (isNoEnd()) {
    checkError();
    checkSpaceOrIsNewLine(); 
    checkNum();
    checkWord();
    checkNoCharOrNumber();
  }
  console.log(wordList);
}
