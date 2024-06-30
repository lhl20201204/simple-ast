import RegExpAst from ".";
import { isInstanceOf } from "../../commonApi";
import RegExpASTItem from "./RegExpASTItem";
import { AST_TYPE, AstFlagDicts, METHOD_TYPE, prefixDicts } from "./constant";

export default class ASTContext {
  constructor(maxCanReferenceIndex) {
    this.config = {};
    this.setConfig = {}
    this.tokens = []
    this.astItemList = [];
    this.charList = [];
    this.methodStore = {}
    // 开始处理捕获组的引用
    this.referencesMap = new Map();
    this.backReferceList = [];
    // 从1开始
    this.referenceIndex = 1;
    this.maxCanReferenceIndex = maxCanReferenceIndex;
    _.forEach(AstFlagDicts, attr => {
      if (attr.startsWith('can')) {
        this.methodStore[prefixDicts.is + _.upperFirst(attr)] = () => this.config[attr] ?? false;
        this.methodStore[prefixDicts.set + _.upperFirst(attr)] = (bol) => {
          if (!this.setConfig[attr]) {
            this.setConfig[attr] = []
          }
          this.setConfig[attr].push(this.methodStore[prefixDicts.is + _.upperFirst(attr)]())
          this.config[attr] = bol;
        }
      } else if (attr.startsWith('push')) {
        this.methodStore[prefixDicts.get + _.upperFirst(attr)] = () => this.config[attr] ?? [];
        this.methodStore[prefixDicts.push + _.upperFirst(attr)] = (anyType) => {
          if (!this.setConfig[attr]) {
            this.setConfig[attr] = []
          }
          this.setConfig[attr].push(_.cloneDeep(this.methodStore[prefixDicts.get + _.upperFirst(attr)]()))

          if (!_.isArray(this.config[attr])) {
            this.config[attr] = [];
          }
          this.config[attr].push(anyType)
        };
      }
      this.methodStore[prefixDicts.reset + _.upperFirst(attr)] = () => {
        this.config[attr] = this.setConfig[attr].pop()
      };
    })
  }

  isVaildReferenceIndex(index) {
    return this.referencesMap.has(index) && isInstanceOf(this.referencesMap.get(index).current, RegExpASTItem)
  }

  vaildBackReferences() {
    for (const ast of this.backReferceList) {
      if (!this.isVaildReferenceIndex(ast.ref)) {
        if (ast.parent.is(AST_TYPE.Alternative)) {
          const list = ast.parent.elements;
          const index = _.findIndex(list, f => f === ast);

          // 子递归解析。第一遍是无穷大，进到这里来之后， 递归执行。限制引用数
          const childAst = new RegExpAst().parse('/' + ast.raw + '/', {
            maxCanReferenceIndex: -1
          })
          // 将raw 切割
          list.splice(index, 1, ...childAst.pattern.alternatives[0].elements)

        } else {
          console.warn(ast.parent)
          throw '未处理的astType'
        }
      }
    }
  }

  createEmptyMaybeReferences() {
    if (!this.referencesMap.has(this.referenceIndex)) {
      this.referencesMap.set(this.referenceIndex, {
        current: null,
        cbList: [],
      });
    }
    return this.referenceIndex++
  }

  pushReferences(index, astItem) {
    if (!isInstanceOf(astItem, RegExpASTItem) || !astItem.is(AST_TYPE.CapturingGroup)) {
      throw 'error'
    }
    this.referencesMap.get(index).current = astItem;
    const cbList = this.referencesMap.get(index).cbList;
    _.forEach(cbList, cb => {
      cb(astItem)
    })
    cbList.splice(0, cbList.length)
  }
  // /\2((f)\1)i\2/
  pushBackreference(index, astItem) {
    if (!isInstanceOf(astItem, RegExpASTItem) || !astItem.is(AST_TYPE.Backreference)) {
      throw 'error'
    }

    if (!this.referencesMap.has(index)) {
      this.referencesMap.set(index, {
        current: null,
        cbList: [],
      });
    }
    if (_.isNil(this.referencesMap.get(index).current)) {
      this.referencesMap.get(index).cbList.push((ast) => {
        ast.references.push(_.cloneDeep(astItem));
      })
    } else {
      this.referencesMap.get(index).current.references.push(_.cloneDeep(astItem));
    }
    this.backReferceList.push(astItem)
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
    for (const x in astItem) {
      const v = astItem[x];
      if (_.isArray(v)) {
        _.forEach(v, c => {
          if (isInstanceOf(c, RegExpASTItem)) {
            c.parent = astItem;
          }
        })
      } else if (isInstanceOf(v, RegExpASTItem)) {
        v.parent = astItem;
      }
    }
    return astItem;
  }
}