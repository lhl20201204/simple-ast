import { getNullValue } from "./Environment/RuntimeValue";
import parseArrayExpression from "./Parse/parseArrayExpression";
import parseAssignmentExpression from "./Parse/parseAssignmentExpression";
import parseBinaryExpression from "./Parse/parseBinaryExpression";
import parseCallExpression from "./Parse/parseCallExpression";
import parseExpressionStatement from "./Parse/parseExpressionStatement";
import parseFunctionDeclaration from "./Parse/parseFunctionDeclaration";
import parseFunctionExpression from "./Parse/parseFunctionExpression";
import parseIdentifier from "./Parse/parseIdentifier";
import parseLiteral from "./Parse/parseLiteral";
import parseMemberExpression from "./Parse/parseMemberExpression";
import parseObjectExpression from "./Parse/parseObjectExpression";
import parseProgram from "./Parse/parseProgram";
import parseReturnStatement from "./Parse/parseReturnStatement";
import parseUnaryExpression from "./Parse/parseUnaryExpression";
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
  }
  console.warn('未匹配的', ast);
  return getNullValue()
}