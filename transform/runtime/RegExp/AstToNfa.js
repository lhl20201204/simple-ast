import { AST_TYPE, Epsilon } from "./constant";
import NFANode from "./NFANode";
import NFARange from "./NFARange";
import { createNode } from "./util";
import { View } from "./view";

class Context {
   constructor() {
      this.stateIndex = 0;
   }

   getStateIndex() {
      return this.stateIndex++;
   }
}

export default class AstToNFA {

   createRange(s, e) {
      return new NFARange(s, e);
   }

   parsePattern(ast, ctx) {
     let start = null;
     let end = null;
     let range = null;
      for(const x of ast.alternatives) {
        const current = this.parse(x, ctx)
        if (range) {
          // 如果有range jiusy
          if (!start) {
            start = createNode(ctx)
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
      for(const x of ast.elements) {
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
      
   }

   parseCapturingGroup(ast, ctx) {
      const current = this.parsePattern(ast, ctx);
      // current.leftJoin(Epsilon, createNode(ctx));
      // current.rightJoin(Epsilon, createNode(ctx));
      // console.warn(_.cloneDeep(current))
      return current;
   }

   parseQuantifier(ast, ctx) {

   }

   parseBackreference(ast, ctx) {

   }

   parseCharacter(ast, ctx) {
      const s = createNode(ctx)
      const e = createNode(ctx)
      s.moveToNext(ast.raw, e)
      return this.createRange(s, e);
   }

   parseCharacterClass(ast, ctx) {

   }

   parseCharacterClassRange(ast, ctx) {

   }

   parseCharacterSet(ast, ctx) {

   }

   parseGroup(ast, ctx) {

   }

   parse(ast, ctx) {
      // 每次返回的应该是一个 NFANode 节点的集合Edge。先写大概布局, 节点之间的连接晚点实现
      switch(ast.type) {
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
     const context = new Context();
     // flag 应该是在context 挂载的，后续做
     // 拿abc 举例子

   //   console.log(ast);
     return this.parse(ast.pattern, context);
   //   View(this.parse(ast.pattern, context))
   }

}