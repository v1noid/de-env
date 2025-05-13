import { copyFile } from "fs";

Bun.build({
  entrypoints: ["./index.ts"],
  outdir: "./dist",
  format: "esm",
  target: "node",
  external: ["commander", "fs"],
  minify: true,
  splitting: true,
});

process.on("beforeExit", async () => {
  copyFile("./package.json", "./dist/package.json", (err) => {
    if (err) {
      console.error(err);
    }
  });
  process.exit(0);
});
