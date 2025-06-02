type EnvTypes = {
  number: number;
  string: string;
  boolean: boolean;
  undefined: undefined;
};

type EnvSchemaArgs = Record<
  string,
  keyof EnvTypes | [Exclude<keyof EnvTypes, "undefined">, "optional"]
>;

type GetCoreType<T> = T extends keyof EnvTypes ? EnvTypes[T] : undefined;

type GetEnvReturnType<
  Schema extends EnvSchemaArgs,
  Type extends keyof Schema
> = Schema[Type] extends [infer T, "optional"]
  ? GetCoreType<T> | undefined
  : GetCoreType<Schema[Type][0]> extends undefined
  ? GetCoreType<Schema[Type]>
  : GetCoreType<Schema[Type][0]>;

function EnvSchema<T extends EnvSchemaArgs>(schema: T) {
  const requires: string[] = [];
  for (const envKey in schema) {
    const optional = Array.isArray(schema[envKey])
      ? schema[envKey]?.[1] === "optional"
      : undefined;

    const type = (
      Array.isArray(schema[envKey]) ? schema[envKey][0] : schema[envKey]
    ).toString();

    const isBoolean =
      type === "boolean" &&
      process.env[envKey] !== "true" &&
      process.env[envKey] !== "false" &&
      !optional &&
      process.env[envKey];

    const isNumber =
      type === "number" &&
      Number.isNaN(Number(process.env[envKey])) &&
      process.env[envKey] &&
      !optional;

    if (!optional && !process.env[envKey]) {
      requires.push(envKey);
    }

    if (isNumber) {
      throw new Error(
        `Expected '${envKey}' to be a number, but got '${typeof process.env[
          envKey
        ]}'`
      );
    }
    if (isBoolean) {
      throw new Error(
        `Expected '${envKey}' to be a boolean, but got '${process.env[envKey]}'`
      );
    }
  }

  if (requires.length) {
    throw new Error(
      `Missing required environment variables: [ ${requires.join(", ")} ]`
    );
  }

  return function getEnv<K extends keyof T>(key: K): GetEnvReturnType<T, K> {
    if (schema[key] === "number")
      return Number(process.env[key.toString()]) as any;
    if (schema[key] === "string") return process.env[key.toString()] as any;
    if (schema[key] === "boolean")
      return (process.env[key.toString()] === "true" ? true : false) as any;
    return undefined as any;
  };
}

export { EnvSchema };
