import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm"],
  entry: ["./src/index.ts", "./src/command.ts"],
  dts: true,
  clean: true,
  external: ["commander", "fs", "path", "ts-morph", "util"],
  outDir: "./dist",
  treeshake: true,
  skipNodeModulesBundle: true,
  minify: true,
  minifySyntax: true,
  minifyWhitespace: true,

  // watch: true,
});
