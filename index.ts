#! /usr/bin/env node

import { Command } from "commander";
import { existsSync, mkdirSync, readFile, readFileSync, watch } from "fs";
import { writeFile } from "fs/promises";
import path from "path";

const program = new Command();

program.name("de-env").description("Easily pare your env file");

program
  .option(
    "-w, --watch",
    "Pass this flag to watch the env file for any changes by default it looks for .env / .env.local"
  )
  .option(
    "-e, --env <string>",
    "If your env is located in a different directory use -e"
  )
  .option(
    "-p, --prefix <string>",
    "By default it usage process.env, using de-env you can use custom prefix"
  )
  .option(
    "-o, --output <string>",
    "If you want to output in a different file, you can also use add .ts/.js/.mjs/.cjs by default it will output in env.ts"
  )
  .option(
    "-c, --commonjs",
    "If you want to output in commonjs format use -c, by default it will output in esm"
  );

program.parse(process.argv);

let options = program.opts<{
  watch: boolean;
  dest: string;
  prefix: string;
  output: string;
  commonjs: boolean;
  env: string;
}>();

const envFile =
  options.env ||
  (existsSync("./.env")
    ? "./.env"
    : existsSync("./.env.local")
    ? "./.env.local"
    : "");

if (!envFile) {
  console.error("No .env / .env.local file found");
  process.exit(1);
}

const output = options.output || (options.commonjs ? "./env.js" : "./env.ts");
const isJs =
  output.endsWith(".js") ||
  output.endsWith(".cjs") ||
  output.endsWith(".mjs") ||
  options.commonjs;

const prefix = options.prefix || "process.env";
const dirname = path.dirname(output);
if (!existsSync(dirname)) mkdirSync(dirname, { recursive: true });
async function generateEnv() {
  const env = readFileSync(envFile, "utf-8").trim();
  const envLines = env.split("\n");

  let envVars: string = "";
  const keys: string[] = [];
  let envTypes: string = "";
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

    if (keys.includes(key))
      console.error(
        `Duplicate key detected: [ ${key} ] at line: ${+lineIndex + 1}`
      );
    else keys.push(key);

    const envType = !value
      ? "undefined"
      : Number.isNaN(+value) || haveQutes
      ? "string"
      : "number";
    const isNumber = envType === "number" && value;
    envVars += `  ${key}: ${
      !value
        ? "undefined"
        : (isNumber ? "Number(" : "") +
          prefix +
          "." +
          key.trim() +
          (isNumber ? ")" : isJs ? "" : "!")
    },\n`;

    envTypes += `  readonly ${key}: ${envType} ${
      value || envType === "undefined" ? "" : "| undefined"
    };\n`;
  }

  await Promise.all([
    writeFile(
      output,
      options.commonjs
        ? `module.exports = {\n${envVars}};`
        : `${isJs ? "" : `type Env = {\n${envTypes}};\n\n`}export const env${
            isJs ? "" : ": Env"
          } = {\n${envVars}};\n`
    ),
    isJs &&
      writeFile(
        "./env.d.ts",
        `declare const env : {\n${envTypes}};\n\nexport { env };`
      ),
  ]);
}

if (options.watch) {
  watch(envFile, async (event) => {
    if (event === "change") {
      await generateEnv();
      console.log("Changes detected parsed", envFile + ", output", output);
    }
  });
}
generateEnv().then(() => console.log("Parsed", envFile + ", output", output));
