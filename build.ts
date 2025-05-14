Bun.build({
  entrypoints: ["./index.ts"],
  outdir: "./dist",
  format: "esm",
  target: "node",
  external: ["commander", "fs", "path"],
  minify: true,
  splitting: true,
});
