import { getNullValue } from "./Environment/RuntimeValue";
import parseArrayExpression from "./Parse/parseArrayExpression";
import parseAssignmentExpression from "./Parse/parseAssignmentExpression";
import parseAssignmentPattern from "./Parse/parseAssignmentPattern";
import parseBinaryExpression from "./Parse/parseBinaryExpression";
import parseBlockStatement from "./Parse/parseBlockStatement";
import parseBreakStatement from "./Parse/parseBreakStatement";
import parseCallExpression from "./Parse/parseCallExpression";
import parseContinueStatement from "./Parse/parseContinueStatement";
import parseExpressionStatement from "./Parse/parseExpressionStatement";
import parseForOfStatement from "./Parse/parseForOfStatement";
import parseForStatement from "./Parse/parseForStatement";
import parseFunctionDeclaration from "./Parse/parseFunctionDeclaration";
import parseFunctionExpression from "./Parse/parseFunctionExpression";
import parseIdentifier from "./Parse/parseIdentifier";
import parseIfStatement from "./Parse/parseIfStatement";
import parseLiteral from "./Parse/parseLiteral";
import parseMemberExpression from "./Parse/parseMemberExpression";
import parseObjectExpression from "./Parse/parseObjectExpression";
import parsePreDeclaration from "./Parse/parsePreDeclaration";
import parseProgram from "./Parse/parseProgram";
import parseReturnStatement from "./Parse/parseReturnStatement";
import parseTemplateElement from "./Parse/parseTemplateElement";
import parseTemplateLiteral from "./Parse/parseTemplateLiteral";
import parseThisExpression from "./Parse/parseThisExpression";
import parseUnaryExpression from "./Parse/parseUnaryExpression";
import parseUpdateExpression from "./Parse/parseUpdateExpression";
import parseVariableDeclaration from "./Parse/parseVariableDeclaration";

export default function parseAst(ast, env) {
  const type  = ast.type;
  switch(type) {
    case 'BinaryExpression' : return parseBinaryExpression(ast, env);
    case 'Identifier': return parseIdentifier(ast, env); 
    case 'VariableDeclaration': return parseVariableDeclaration(ast, env);
    case 'ObjectExpression': return parseObjectExpression(ast, env);
    case 'Literal': return parseLiteral(ast); 
    case 'Program': return parseProgram(ast); 
    case 'ArrayExpression': return parseArrayExpression(ast, env);
    case 'MemberExpression': return parseMemberExpression(ast, env);
    case 'FunctionDeclaration': return parseFunctionDeclaration(ast, env);
    case 'CallExpression': return parseCallExpression(ast, env);
    case 'ReturnStatement': return parseReturnStatement(ast,env);
    case 'AssignmentExpression': return parseAssignmentExpression(ast, env);
    case 'UnaryExpression': return parseUnaryExpression(ast, env);
    case 'ExpressionStatement': return parseExpressionStatement(ast, env);
    case 'FunctionExpression': return parseFunctionExpression(ast, env);
    case 'IfStatement': return parseIfStatement(ast, env);
    case 'ThisExpression': return parseThisExpression(ast, env);
    case 'TemplateLiteral': return parseTemplateLiteral(ast, env);
    case 'TemplateElement': return parseTemplateElement(ast, env);
    case 'BlockStatement': return parseBlockStatement(ast, env);
    case 'PreDeclaration': return parsePreDeclaration(ast, env);
    case 'EmptyStatement': return getNullValue();
    case 'ForOfStatement': return parseForOfStatement(ast, env);
    case 'ContinueStatement': return parseContinueStatement(ast, env);
    case 'AssignmentPattern': return parseAssignmentPattern(ast, env);
    case 'BreakStatement': return parseBreakStatement(ast, env);
    case 'ForStatement': return parseForStatement(ast, env);
    case 'UpdateExpression': return parseUpdateExpression(ast, env);
  }
  console.warn('未匹配的parseAst', ast);
  return getNullValue()
}