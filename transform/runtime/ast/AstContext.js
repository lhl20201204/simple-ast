import { AstFlagDicts, prefixDicts } from "./constants";

export default class ASTContext {
  constructor() {
    this.config = {};
    this.setConfig = {}
    this.configStack = [];
    this.tokens = []
    this.astItemList = [];
    this.charList = [];
    this.methodStore = {}
    _.forEach(AstFlagDicts, attr => {
      this.methodStore[prefixDicts.is + _.upperFirst(attr)] = () => this.config[attr] ?? false;
      this.methodStore[prefixDicts.set +  _.upperFirst(attr)] = (bol) => {
        if (!this.setConfig[attr]) {
          this.setConfig[attr] = []
        }
        this.setConfig[attr].push(this.methodStore[prefixDicts.is + _.upperFirst(attr)]())
        this.config[attr] = bol;
      }
      this.methodStore[prefixDicts.reset + _.upperFirst(attr)] = () => { 
        this.config[attr] =  this.setConfig[attr].pop()
      };
    })
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