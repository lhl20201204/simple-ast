import { createAssertView } from "./AssertView";
import { AST_TYPE, Epsilon, TAG_DICTS } from "./constant";
import NFANode from "./NFANode";
import NFARange from "./NFARange";
import { createAcceptStr, createNode, getBasicEdgeConfig, getNotCurveConfig, transformCharacterSet } from "./util";
import { View } from "./view";

class AstToNFAContext {
   constructor() {
      this.stateIndex = 0;
      this.references = new Map();
      this.currentReferencesIndexList = [];
      this.tempPlaceholderMap = new Map();
      this.fixRangeRelationTaskList = [];
      this.assertionAstList = [];
   }

   pushAssertionAst(ast) {
      this.assertionAstList.push(ast);
   }

   pushPlaceholder(index, range) {
      if (!this.tempPlaceholderMap.has(index)) {
         this.tempPlaceholderMap.set(index, []);
      }
      this.tempPlaceholderMap.get(index).push(range.clone());
   }

   checkPlaceholder(index, targetRange)  {
      if (this.tempPlaceholderMap.has(index)) { 
         const tempList = this.tempPlaceholderMap.get(index);
         this.fixRangeRelationTaskList.push(
            [tempList, _.cloneDeep(targetRange)]
         )
         this.tempPlaceholderMap.delete(index);
      }
   }

   fixRange() {
      while(this.fixRangeRelationTaskList.length) {
         const [tempList, targetRange] = this.fixRangeRelationTaskList.shift();
         for(const rangeItem of tempList) {
            const inList = rangeItem.start.inList;
            const outList = rangeItem.end.outList;
            const copyRange = targetRange.deepClone(this);
            if (!_.size(inList)) {
               rangeItem.start.replace(copyRange.start)
            }
            for(const x of inList) {
              x.changeEnd(copyRange.start)
            }
            if (!_.size(outList)) {
              rangeItem.end.replace(copyRange.end);
            }
            for(const x of outList) {
               x.changeStart(copyRange.end);
            }
         }
      }
   }

   pushReferencesIndex(index) {
      this.currentReferencesIndexList.push(index)
   }

   popReferencesIndex() {
      this.currentReferencesIndexList.pop()
   }

   isInvaildIndex(index) {
      return (this.currentReferencesIndexList).includes(index);
   }

   setReferences(index, ast) {
      this.references.set(index, ast);
   }

   hadReferenceIndex(index) {
      return this.references.has(index);
   }

   getReferenceByIndex(index) {
      // if (!this.references.has(index)) {
      //    console.log('------', index)
      //    throw '运行时错误'
      // }
      return this.references.get(index)
   }

   getStateIndex() {
      return this.stateIndex++;
   }
}

export default class AstToNFA {

   createRange(s, e) {
      return new NFARange(s, e);
   }

   createAssertionRange(ctx, ast) {
      const s = createNode(ctx);
      const e = createNode(ctx);
      s.moveToNext(createAcceptStr('点击', ast.negate, createAssertView(ast)), e, getBasicEdgeConfig());
      return this.createRange(s, e);
   }

   parsePattern(ast, ctx) {
     const range = this.innerParsePattern(ast, ctx);
     range.start.markTag(TAG_DICTS.START, range);
     range.end.markTag(TAG_DICTS.END, range);
     return range;
   }

   innerParsePattern(ast, ctx) {
      let start = null;
      let end = null;
      let range = null;
      for (const x of ast.alternatives) {
         const current = this.parse(x, ctx)
         if (range) {
            // 如果有range jiusy
            if (!start) {
               start = createNode(ctx);
               end = createNode(ctx)
               // 拼上头尾
               range.leftJoin(Epsilon, start);
               range.rightJoin(Epsilon, end);
            }
            current.leftJoin(Epsilon, start);
            current.rightJoin(Epsilon, end);
         } else {
            range = current;
         }
      }
      return range;
   }

   parseAlternative(ast, ctx) {
      let range = null;
      for (const x of ast.elements) {
         const current = this.parse(x, ctx)
         if (range) {
            range.merge(current, ctx);
         } else {
            range = current;
         }
      }
      return range;
   }

   parseAssertion(ast, ctx) {
      // TODO
      return this.createAssertionRange(ctx, ast)
   }

   parseCapturingGroup(ast, ctx) {
      if (_.size((ast.references))) {
         ctx.pushReferencesIndex(ast.references[0].ref);
      }
      const current = this.innerParsePattern(ast, ctx);
      for (const x of ast.references) {
         ctx.setReferences(x.ref, _.cloneDeep(ast));
      }
      if (_.size((ast.references))) {
         // 嵌套关系。
         ctx.checkPlaceholder(ast.references[0].ref, current);
         ctx.popReferencesIndex();
      }
      return current;
   }

   parseQuantifier(ast, ctx) {
      const current = this.parse(ast.element, ctx);
      current.joinQuantifier(ctx, ast)
      return current;
   }

   parseBackreference(ast, ctx) {
      if (ctx.isInvaildIndex(Number(ast.ref))) {
         const s = createNode(ctx)
         const e = createNode(ctx)
         s.moveToNext(createAcceptStr('\\ε'), e, getBasicEdgeConfig())
         const ret = this.createRange(s, e);
         return ret;
      }

      // 1, 引用出现在group后， /(f)\1/, 这种情况直接拿astcopy。
      if (ctx.hadReferenceIndex(ast.ref)) {
         return this.parse(ctx.getReferenceByIndex(ast.ref), ctx);
      }

      // 2, 所匹配的group 还没有出现，  /\1(f)/， 这种存个占位符。匹配到(f)回去修改。
      const s = createNode(ctx)
      const e = createNode(ctx)
      s.moveToNext(createAcceptStr('\\ε'), e, getBasicEdgeConfig())
      const ret = this.createRange(s, e);
      ctx.pushPlaceholder(ast.ref, ret)
      return ret;
   }

   parseCharacter(ast, ctx) {
      const s = createNode(ctx)
      const e = createNode(ctx)
      s.moveToNext(createAcceptStr(ast.raw), e, getBasicEdgeConfig())
      return this.createRange(s, e);
   }

   parseCharacterClass(ast, ctx) {
      const s = createNode(ctx)
      const e = createNode(ctx)
      // TODO ctx 要设置栈negate。
      for(const x of ast.elements) {
        const childRange = this.parse(x, ctx);
        s.moveToNext(Epsilon ,childRange.start, getBasicEdgeConfig());
        childRange.end.moveToNext(Epsilon, e, getBasicEdgeConfig());
      }
      return this.createRange(s, e);
   }

   parseCharacterClassRange(ast, ctx) {
      const s = createNode(ctx);
      const e = createNode(ctx);
      const min = ast.min.value;
      const max = ast.max.value;
      s.moveToNext(createAcceptStr(_.map(new Array(max- min + 1), (c, i) => {
         return String.fromCharCode(i + min);
      })), e, getBasicEdgeConfig())
      return this.createRange(s, e);
   }

   parseCharacterSet(ast, ctx) {
      const s = createNode(ctx)
      const e = createNode(ctx)
      s.moveToNext(createAcceptStr(ast.raw), e, getBasicEdgeConfig())
      return this.createRange(s, e);
   }

   parseGroup(ast, ctx) {
      return this.innerParsePattern(ast, ctx);
   }

   parse(ast, ctx) {
      // 每次返回的应该是一个 NFANode 节点的集合Edge。先写大概布局, 节点之间的连接晚点实现
      switch (ast.type) {
         case AST_TYPE.Alternative: return this.parseAlternative(ast, ctx);
         case AST_TYPE.Assertion: return this.parseAssertion(ast, ctx)
         case AST_TYPE.Backreference: return this.parseBackreference(ast, ctx);
         case AST_TYPE.Character: return this.parseCharacter(ast, ctx);
         case AST_TYPE.CharacterClass: return this.parseCharacterClass(ast, ctx)
         case AST_TYPE.CharacterClassRange: return this.parseCharacterClassRange(ast, ctx)
         case AST_TYPE.CharacterSet: return this.parseCharacterSet(ast, ctx);
         case AST_TYPE.CapturingGroup: return this.parseCapturingGroup(ast, ctx);
         case AST_TYPE.Quantifier: return this.parseQuantifier(ast, ctx);
         case AST_TYPE.Pattern: return this.parsePattern(ast, ctx);
         case AST_TYPE.Group: return this.parseGroup(ast, ctx)
      }
      throw '未处理'
   }

   transfrom(ast) {
      const context = new AstToNFAContext();
      // flag 应该是在context 挂载的，后续做
      // 拿abc 举例子

      console.log(ast);
      const ret = this.parse(ast.pattern, context);
      context.fixRange();
      return ret;
      //   View(this.parse(ast.pattern, context))
   }

}