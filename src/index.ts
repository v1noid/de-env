
type EnvType = "number" | "string" | "boolean";



function EnvConfig<T extends Record<string, EnvType | [EnvType, "required"]>>(
  env: T
) {
  for (const envKey in env) {
    const required = Array.isArray(env[envKey]) ? !!env[envKey][1] : undefined;
    const key = (
      Array.isArray(env[envKey]) ? env[envKey][0] : env[envKey]
    ).toString();
    if (required && !process.env[key]) {
      console.error(`${envKey} is required`);
      process.exit(1);
    }
    if (key === "number" && Number.isNaN(Number(process.env[key]))) {
      console.error(
        `Expected '${envKey}' to be a number, but got '${typeof process.env[
          envKey
        ]}'`
      );
      process.exit(1);
    }
    if (
      key === "boolean" &&
      process.env[envKey] !== "true" &&
      process.env[envKey] !== "false"
    ) {
      console.error(
        `Expected '${envKey}' to be a boolean, but got '${process.env[envKey]}'`
      );
      process.exit(1);
    }
  }

  return function getEnv<K extends keyof T>(
    key: K
  ): T[K] extends "number"
    ? number
    : T[K] extends "string"
    ? string
    : T[K] extends "boolean"
    ? boolean
    : undefined {
    if (env[key] === "number")
      return Number(process.env[key.toString()]) as any;
    if (env[key] === "string") return process.env[key.toString()] as any;
    if (env[key] === "boolean")
      return Boolean(process.env[key.toString()]) as any;
    return undefined as any;
  };
}

export { EnvConfig };
