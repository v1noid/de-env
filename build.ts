Bun.build({
  entrypoints: ["./src/index.ts", "./src/command.ts"],
  outdir: "./dist",
  format: "esm",
  target: "node",
  external: ["commander", "fs", "path", "ts-morph"],
  minify: true,
  splitting: true,
});
