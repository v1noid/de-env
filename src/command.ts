#! /usr/bin/env node

import { Command } from "commander";
import { existsSync, readFileSync } from "fs";

import { SyntaxKind } from "ts-morph";
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
    console.error(`${outputPath} does not exist`);
    process.exit(1);
  }
  const sourceFile = project.addSourceFileAtPath(outputPath);
  const env = readFileSync(envPath, "utf-8").trim();
  const envLines = env.split("\n");

  let envVars: string = "";
  const keys: string[] = [];

  for (let lineIndex in envLines) {
    const line = envLines[lineIndex].trim();
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

    envVars += `  ${key}: ${
      !value
        ? `"undefined"`
        : value === "true" || value === "false"
        ? `"boolean"`
        : Number.isNaN(+value)
        ? `"string"`
        : `"number"`
    },\n`;
  }

  const envConfig = sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .find((node) => node.getExpression().getText() === "EnvConfig");
  console.log(`Parse ${envPath} \n{\n${envVars}}`);
  envConfig?.getArguments()[0].replaceWithText(`{\n${envVars}}`);
  project.saveSync();
  console.log(`Saved ${outputPath}`);
}
