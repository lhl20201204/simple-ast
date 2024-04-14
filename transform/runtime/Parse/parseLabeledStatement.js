import parseAst from "..";
import createEnviroment, { createEmptyEnviromentExtraConfig } from "../Environment/createEnviroment";
import { ENV_DICTS } from "../constant";
import { innerParseWhileStatement } from "./parseWhileStatement";

export default function parseLabeledStatement(ast, env) {
  const childEnv = createEnviroment('labeled_env', env, {
    [ENV_DICTS.isLabelEnv]: true,
    [ENV_DICTS.currentEnvLabelValue]: ast.label.name ?? null,
  }, createEmptyEnviromentExtraConfig())
   return parseAst(ast.body, childEnv)
}