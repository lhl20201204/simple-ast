import { getDebugging } from "../../debugger";
import { PrivateIdentifierNameTransform, isInstanceOf } from "../commonApi";
import AstConfig, { ensureAstHadConfig, withRecordEnvStack } from "./Environment/Generator/AstConfig";
import { getNullValue } from "./Environment/RuntimeValueInstance";
import generateCode from "./Generate";
import parseArrayExpression from "./Parse/parseArrayExpression";
import parseArrowFunctionExpression from "./Parse/parseArrowFunctionExpression";
import parseAssignmentExpression from "./Parse/parseAssignmentExpression";
import parseAssignmentPattern from "./Parse/parseAssignmentPattern";
import parseAwaitExpression from "./Parse/parseAwaitExpression";
import parseBinaryExpression from "./Parse/parseBinaryExpression";
import parseBlockStatement from "./Parse/parseBlockStatement";
import parseBreakStatement from "./Parse/parseBreakStatement";
import parseCallExpression from "./Parse/parseCallExpression";
import parseChainExpression from "./Parse/parseChainExpression";
import parseClassDeclaration from "./Parse/parseClassDeclaration";
import parseClassExpression from "./Parse/parseClassExpression";
import parseConditionalExpression from "./Parse/parseConditionalExpression";
import parseContinueStatement from "./Parse/parseContinueStatement";
import parseDebuggerStatement from "./Parse/parseDebuggerStatement";
import parseDoWhileStatement from "./Parse/parseDoWhileStatement";
import parseExpressionStatement from "./Parse/parseExpressionStatement";
import parseForInStatement from "./Parse/parseForInStatement";
import parseForOfStatement from "./Parse/parseForOfStatement";
import parseForStatement from "./Parse/parseForStatement";
import parseFunctionDeclaration from "./Parse/parseFunctionDeclaration";
import parseFunctionExpression from "./Parse/parseFunctionExpression";
import parseGetRuntimeValueExpression from "./Parse/parseGetRuntimeValueExpression";
import parseIdentifier from "./Parse/parseIdentifier";
import parseIfStatement from "./Parse/parseIfStatement";
import parseLabeledStatement from "./Parse/parseLabeledStatement";
import parseLiteral from "./Parse/parseLiteral";
import parseLogicalExpression from "./Parse/parseLogicalExpression";
import parseMemberExpression from "./Parse/parseMemberExpression";
import parseNewExpression from "./Parse/parseNewExpression";
import parseObjectExpression from "./Parse/parseObjectExpression";
import parsePreDeclaration from "./Parse/parsePreDeclaration";
import parseProgram from "./Parse/parseProgram";
import parseReturnStatement from "./Parse/parseReturnStatement";
import parseRuntimeValueExpression from "./Parse/parseRuntimeValueExpression";
import parseSequenceExpression from "./Parse/parseSequenceExpression";
import parseSleepStatement from "./Parse/parseSleepStatement";
import parseSpreadElement from "./Parse/parseSpreadElement";
import parseSuper from "./Parse/parseSuper";
import parseSwitchStatement from "./Parse/parseSwitchStatement";
import parseTaggedTemplateExpression from "./Parse/parseTaggedTemplateExpression";
import parseTemplateElement from "./Parse/parseTemplateElement";
import parseTemplateLiteral from "./Parse/parseTemplateLiteral";
import parseThisExpression from "./Parse/parseThisExpression";
import parseThrowStatement from "./Parse/parseThrowStatement";
import parseTryStatement from "./Parse/parseTryStatement";
import parseUnaryExpression from "./Parse/parseUnaryExpression";
import parseUpdateExpression from "./Parse/parseUpdateExpression";
import parseUseRuntimeValueExpression from "./Parse/parseUseRuntimeValueExpression";
import parseVariableDeclaration from "./Parse/parseVariableDeclaration";
import parseWhileStatement from "./Parse/parseWhileStatement";
import parseWithStatement from "./Parse/parseWithStatement";
import parseYieldExpression from "./Parse/parseYieldExpression";
import { AST_DICTS, DEBUGGER_DICTS } from "./constant";

let id = 0;

export function innerParseAst(ast, env) {
  if(!env){
    throw new Error('env 必传')
  }
  // if (id ++ > 403) {
  //   return;
  // }
  // console.log( generateCode(ast));
  const type  = ast.type;
  switch(type) {  
    case 'AwaitExpression': return parseAwaitExpression(ast, env);
    case 'ArrowFunctionExpression': return parseArrowFunctionExpression(ast, env);
    case 'ArrayExpression': return parseArrayExpression(ast, env); 
    case 'AssignmentExpression': return parseAssignmentExpression(ast, env);
    case 'AssignmentPattern': return parseAssignmentPattern(ast, env);
    case 'BreakStatement': return parseBreakStatement(ast, env);
    case 'BlockStatement': return parseBlockStatement(ast, env);
    case 'BinaryExpression' : return parseBinaryExpression(ast, env); 
    case 'CallExpression': return parseCallExpression(ast, env);
    case 'ConditionalExpression': return parseConditionalExpression(ast, env);
    case 'ChainExpression': return parseChainExpression(ast, env);
    case 'ContinueStatement': return parseContinueStatement(ast, env); 
    case 'ClassExpression': return parseClassExpression(ast, env);
    case 'ClassDeclaration': return parseClassDeclaration(ast, env);
    case 'DebuggerStatement': return parseDebuggerStatement(ast, env);
    case 'DoWhileStatement': return parseDoWhileStatement(ast, env);
    case 'ExpressionStatement': return parseExpressionStatement(ast, env);
    case 'EmptyStatement': return getNullValue();
    case 'ForStatement': return parseForStatement(ast, env);
    case 'ForOfStatement': return parseForOfStatement(ast, env);
    case 'ForInStatement': return parseForInStatement(ast, env);
    case 'FunctionExpression': return parseFunctionExpression(ast, env);
    case 'FunctionDeclaration': return parseFunctionDeclaration(ast, env);
    case 'IfStatement': return parseIfStatement(ast, env);
    case 'Identifier': return parseIdentifier(ast, env); 
    case 'Literal': return parseLiteral(ast);  
    case 'LabeledStatement': return parseLabeledStatement(ast, env); 
    case 'LogicalExpression': return parseLogicalExpression(ast, env);
    case 'MetaProperty': // TODO 先让他跟Member一样执行
    case 'MemberExpression': return parseMemberExpression(ast, env);
    case 'NewExpression': return parseNewExpression(ast, env);
    case 'ObjectExpression': return parseObjectExpression(ast, env);
    case 'PrivateIdentifier': return parseIdentifier(PrivateIdentifierNameTransform(ast), env);
    case 'Program': return parseProgram(ast); 
    case 'ReturnStatement': return parseReturnStatement(ast,env);
    case 'Super': return parseSuper(ast, env);
    case 'SequenceExpression': return parseSequenceExpression(ast, env);
    case 'SleepStatement': return parseSleepStatement(ast, env);
    case 'SpreadElement': return parseSpreadElement(ast,env);
    case 'SwitchStatement': return parseSwitchStatement(ast, env);
    case  'TaggedTemplateExpression': return parseTaggedTemplateExpression(ast, env);
    case 'ThrowStatement': return parseThrowStatement(ast, env);
    case 'TryStatement': return parseTryStatement(ast, env);
    case 'ThisExpression': return parseThisExpression(ast, env);
    case 'TemplateLiteral': return parseTemplateLiteral(ast, env);
    case 'TemplateElement': return parseTemplateElement(ast, env);
    case 'UnaryExpression': return parseUnaryExpression(ast, env); 
    case 'UpdateExpression': return parseUpdateExpression(ast, env);
    case 'VariableDeclaration': return parseVariableDeclaration(ast, env);
    case 'WithStatement': return parseWithStatement(ast, env);
    case 'WhileStatement': return parseWhileStatement(ast, env);
    case 'YieldExpression': return parseYieldExpression(ast, env);
    case AST_DICTS.RuntimeValue: return parseRuntimeValueExpression(ast, env);
    case AST_DICTS.UseRuntimeValue: return parseUseRuntimeValueExpression(ast, env);
    case AST_DICTS.GetRuntimeValue: return parseGetRuntimeValueExpression(ast, env);
    case AST_DICTS.PreDeclaration: return parsePreDeclaration(ast, env);
  }
  console.warn('未匹配的parseAst', ast);
  return getNullValue()
}

let loop = 0;

export function setLoop(x) {
  loop = 0;
}

export default function parseAst(ast, env) {
  // if (getDebugging()) {
    // console.log(generateCode(ast));
  // }
  // console.log(generateCode(ast));
  // if (loop++ > 6000) {
  //   return;
  // }
  return withRecordEnvStack(ast, env, innerParseAst);
}