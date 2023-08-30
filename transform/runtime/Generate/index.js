import _ from "lodash";
import { getClassBodyCode, getClassDeclarationCode, getClassExpressionCode, getMethodDefinitionCode, getNewExpressionCode, getPropertyDefinitionCode, getSuperCode } from "./classCode";
import { getArrayExpressionCode, getArrayPatternCode, getArrowFunctionExpressionCode, getAssignmentExpressionCode, getAssignmentPatternCode, getAwaitExpressionCode, getBinaryExpressionCode, getBlockStatementCode, getBreakStatementCode, getCallExpressionCode, getCallFunctionExpressionCode, getChainExpressionCode, getConditionalExpressionCode, getContinueStatementCode, getDebuggerStatementCode, getExpressionStatementCode, getForInStatementCode, getForOfStatementCode, getForStatementCode, getFunctionDeclarationCode, getFunctionExpressionCode, getIdentifierCode, getIfStatementCode, getLiteralCode, getLogicalExpressionCode, getMemberExpressionCode, getObjectExpressionCode, getObjectPatternCode, getPreDeclarationCode, getProgramCode, getRestElementCode, getReturnStatementCode, getRuntimeValueCode, getSpreadElementCode, getStaticBlockCode, getSwitchStatementCode, getTemplateElementCode, getTemplateLiteralCode, getThisExpressionCode, getThrowStatementCode, getTryStatementCode, getUnaryExpressionCode, getUpdateExpressionCode, getVariableDeclarationCode, getWhileStatementCode, getYieldExpressionCode } from "./commonCode";
import { AST_DICTS, DEBUGGER_DICTS } from "../constant";

export function getAstCode(ast, config) {
  if (!config) {
    throw new Error('没有config');
  }

  // console.log(ast);

  const type = ast.type;
  switch (type) { 
    case 'AwaitExpression': return getAwaitExpressionCode(ast, config);
    case 'ArrowFunctionExpression': return getArrowFunctionExpressionCode(ast, config);
    case 'ArrayPattern': return getArrayPatternCode(ast, config);
    case 'ArrayExpression': return getArrayExpressionCode(ast, config);
    case 'AssignmentPattern': return getAssignmentPatternCode(ast, config);
    case 'AssignmentExpression': return getAssignmentExpressionCode(ast, config);
    case 'BinaryExpression': return getBinaryExpressionCode(ast, config);
    case 'BreakStatement': return getBreakStatementCode(ast, config);
    case 'BlockStatement': return getBlockStatementCode(ast, config);
    case 'CallExpression': return getCallExpressionCode(ast, config);
    case 'CallFunctionExpression': return getCallFunctionExpressionCode(ast, config);
    case 'ChainExpression': return getChainExpressionCode(ast, config);
    case 'ConditionalExpression': return getConditionalExpressionCode(ast, config);
    case 'ContinueStatement': return getContinueStatementCode(ast, config);
    case 'ClassDeclaration': return getClassDeclarationCode(ast, config);
    case 'ClassBody': return getClassBodyCode(ast, config);
    case 'ClassExpression': return getClassExpressionCode(ast, config)
    case 'DebuggerStatement': return getDebuggerStatementCode(ast, config);
    case 'EmptyStatement': return ';';
    case 'ExpressionStatement': return getExpressionStatementCode(ast, config);
    case 'FunctionExpression': return getFunctionExpressionCode(ast, config);
    case 'FunctionDeclaration': return getFunctionDeclarationCode(ast, config);
    case 'ForOfStatement': return getForOfStatementCode(ast,config);
    case 'ForStatement': return getForStatementCode(ast, config);
    case 'ForInStatement': return getForInStatementCode(ast, config);
    case 'Identifier': return getIdentifierCode(ast, config);
    case 'IfStatement': return getIfStatementCode(ast, config);
    case 'Literal': return getLiteralCode(ast, config); 
    case 'LogicalExpression': return getLogicalExpressionCode(ast, config);
    case 'MemberExpression': return getMemberExpressionCode(ast, config);
    case 'MethodDefinition': return getMethodDefinitionCode(ast, config);
    case 'NewExpression': return getNewExpressionCode(ast, config);
    case 'ObjectExpression': return getObjectExpressionCode(ast, config);
    case 'ObjectPattern': return getObjectPatternCode(ast, config);
    case 'Program': return getProgramCode(ast, config);
    case 'PropertyDefinition': return getPropertyDefinitionCode(ast, config);
    case 'ReturnStatement': return getReturnStatementCode(ast, config);
    case 'RestElement': return getRestElementCode(ast, config);
    case 'RuntimeValue': return getRuntimeValueCode(ast, config);
    case 'Super': return getSuperCode(ast, config);
    case 'StaticBlock': return getStaticBlockCode(ast, config);
    case 'SwitchStatement': return getSwitchStatementCode(ast, config);
    case 'SpreadElement': return getSpreadElementCode(ast, config);
    case 'ThrowStatement': return getThrowStatementCode(ast, config);
    case 'ThisExpression': return getThisExpressionCode(ast, config);
    case 'TemplateLiteral': return getTemplateLiteralCode(ast, config);
    case 'TryStatement': return getTryStatementCode(ast, config);
    case 'TemplateElement': return getTemplateElementCode(ast, config);
    case 'UnaryExpression': return getUnaryExpressionCode(ast, config);
    case 'UpdateExpression': return getUpdateExpressionCode(ast, config);
    case 'VariableDeclaration': return getVariableDeclarationCode(ast, config);
    case 'WhileStatement': return getWhileStatementCode(ast, config);
    case 'YieldExpression': return getYieldExpressionCode(ast, config);
    case AST_DICTS.PreDeclaration: return getPreDeclarationCode(ast, config);
  }
  console.warn('ast to code fail', ast);
  return ''
}


export default function generateCode(ast, config ={} ) {
  if (!config[DEBUGGER_DICTS.prefixSpaceCount]) {
    config[DEBUGGER_DICTS.prefixSpaceCount] = 0;
  }
  return getAstCode(ast, config)
}