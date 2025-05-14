import packageJson from "./package.json";
import { execSync } from "child_process";
const type = process.argv[2];

const [major, minor, patch] = packageJson.version.split(".");
if (type === "-m") {
  packageJson.version = `${+major + 1}.0.0`;
} else if (type === "-n") {
  packageJson.version = `${major}.${+minor + 1}.0`;
} else if (type === "-p") {
  packageJson.version = `${major}.${minor}.${+patch + 1}`;
}

execSync("npm publish");
