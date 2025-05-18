#! /usr/bin/env node

import { Command } from "commander";
import { existsSync, readFileSync, writeFileSync } from "fs";

import {  SyntaxKind, VariableDeclarationKind } from "ts-morph";
import { Project } from "ts-morph";

const program = new Command();

const project = new Project();

program.name("de-env").description("Easily pare your env file");

program.command("parse <env-path> <output-path>").action(generateEnv);
program.parse(process.argv);

async function generateEnv(envPath: string, outputPath: string) {
  if (!existsSync(envPath)) {
    console.error(`${envPath} does not exist`);
    process.exit(1);
  }

  if (!existsSync(outputPath)) {
    writeFileSync(outputPath, "");
  }

  const sourceFile = project.addSourceFileAtPath(outputPath);
  const env = readFileSync(envPath, "utf-8").trim();
  const envLines = env.split("\n");

  let envVars = "";
  const keys: string[] = [];
  let required: 'one' | 'multi' | '' = '';
  for (let lineIndex in envLines) {
    const line = envLines[lineIndex].trim();
    if(line === '#!!!') {
      required = 'multi';
      console.log(required)
      continue;
    }
    if(required === 'multi' && line === '#---') {
      required = '';
    }
    if (line === "#!") {
      required = 'one';
      continue;
    }

    if (line.startsWith("#") || !line) continue;

    let [key, value] = line.split("=");
    key = key.trim();
    value = value.trim();
    const haveQutes = value.startsWith('"') || value.startsWith("'");

    if (haveQutes) value = value.slice(1, value.length - 1);
    else if (value.includes("#")) value = value.slice(0, value.indexOf("#"));

    if (!key) continue;

    if (keys.includes(key)) {
      console.error(
        `Duplicate key detected: [ ${key} ] at line: ${+lineIndex + 1}`
      );
      process.exit(1);
    } else keys.push(key);
    const type = !value
      ? `"undefined"`
      : value === "true" || value === "false"
      ? `"boolean"`
      : Number.isNaN(+value)
      ? `"string"`
      : `"number"`;
    
    envVars += `  ${key}:${required ? `[${type}, "required"]` : type},\n`;
    if(required === 'one') {
      required = '';
    }
    
  }

  let EnvSchema = sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .find((node) => node.getExpression().getText() === "EnvSchema");

  const pathOfPkg =
    process.env.NODE_ENV === "development" ? "./src/index.ts" : "de-env";

  envVars = `{\n${envVars}}`;
  if (!EnvSchema) {
    !sourceFile.getImportDeclaration(pathOfPkg)?.getFullText() &&
      sourceFile.addImportDeclaration({
        moduleSpecifier: pathOfPkg,
        namedImports: ["EnvSchema"],
      });
      sourceFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [{ name: "Env", initializer: `EnvSchema(${envVars})` }],
      });
    EnvSchema = sourceFile
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .find((node) => node.getExpression().getText() === "EnvSchema");
  }

  const EnvSchemaArgs = EnvSchema?.getArguments()?.[0];
  if (!EnvSchemaArgs) {
    EnvSchema?.addArgument(envVars);
  } else {
    EnvSchemaArgs.replaceWithText(envVars);
  }

  project.saveSync();
  console.log(`Saved ${outputPath}`);
}
