import { AstConfigDicts } from "./constants";

export default class ASTContext {
  constructor() {
    this.config = {};
    this.configStack = [];
    this.tokens = []
    this.astItemList = [];
    this.charList = [];
  }

  isSpreadable() {
    return this.config[AstConfigDicts.isSpreadable]
  }

  setSpreadable(bol) {
    this.config[AstConfigDicts.isSpreadable] = bol;
  }

  canYieldable() {
    return this.config[AstConfigDicts.canYieldable]
  }

  pushToken(token) {
    this.tokens.push(token)
    return token;
  }

  pushTokenChar(char) {
    this.charList.push(char)
    return char;
  }

  pushAstItem(astItem) {
    this.astItemList.push(astItem)
    return astItem;
  }

  save() {
    this.configStack.push(_.cloneDeep(this.config))
  }

  restore() {
    this.config = _.cloneDeep(this.configStack.pop())
  }
}