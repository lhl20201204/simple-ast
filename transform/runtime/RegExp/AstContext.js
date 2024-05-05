import { isInstanceOf } from "../../commonApi";
import RegExpASTItem from "./RegExpASTItem";
import { AST_TYPE, AstFlagDicts, prefixDicts } from "./constant";

export default class ASTContext {
  constructor() {
    this.config = {};
    this.setConfig = {}
    this.tokens = []
    this.astItemList = [];
    this.charList = [];
    this.methodStore = {}
    // 开始处理捕获组的引用
    this.referencesMap = new Map();
    // 从1开始
    this.referenceIndex = 1;
    _.forEach(AstFlagDicts, attr => {
      if (attr.startsWith('can')) {
        this.methodStore[prefixDicts.is + _.upperFirst(attr)] = () => this.config[attr] ?? false;
        this.methodStore[prefixDicts.set +  _.upperFirst(attr)] = (bol) => {
          if (!this.setConfig[attr]) {
            this.setConfig[attr] = []
          }
          this.setConfig[attr].push(this.methodStore[prefixDicts.is+ _.upperFirst(attr)]())
          this.config[attr] = bol;
        }
      } else if (attr.startsWith('push')) {
        this.methodStore[prefixDicts.get + _.upperFirst(attr)] = () => this.config[attr] ?? [];
        this.methodStore[prefixDicts.push + _.upperFirst(attr)] = (anyType) => {
          if (!this.setConfig[attr]) {
            this.setConfig[attr] = []
          }
          this.setConfig[attr].push(_.cloneDeep(this.methodStore[ prefixDicts.get + _.upperFirst(attr)]()))
          
          if (!_.isArray(this.config[attr])) {
            this.config[attr] = [];
          }
          this.config[attr].push(anyType)
        };
      }
      this.methodStore[prefixDicts.reset + _.upperFirst(attr)] = () => { 
        this.config[attr] =  this.setConfig[attr].pop()
      };
    })
  }

  getReferencesIndex() {
    return this.referenceIndex++
  }

  pushReferences(index, astItem) {
    if (!isInstanceOf(astItem, RegExpASTItem) || !astItem.is(AST_TYPE.CapturingGroup)) {
      throw 'error'
    }
    this.referencesMap.set(index, astItem);
  }

  checkBackreferenceByIndex(index) {
    return this.referencesMap.has(index)
  }

  pushBackreference(index, astItem) {
    if (!isInstanceOf(astItem, RegExpASTItem) || !astItem.is(AST_TYPE.Backreference)) {
      throw 'error'
    }
    if (!this.checkBackreferenceByIndex(index)) {
      return false;
    }
    this.referencesMap.get(index).references.push(_.cloneDeep(astItem))
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
}