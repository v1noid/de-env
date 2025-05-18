type EnvTypes = {
  number: number;
  string: string;
  boolean: boolean;
};

type Options<T extends keyof EnvTypes> = {
  optional: boolean;
  validator?: (value: EnvTypes[T]) => boolean;
};

type OptionsSchema = {
  [K in keyof EnvTypes]: [K, Options<K>];
};

type ArraySchema = keyof EnvTypes | OptionsSchema[keyof OptionsSchema];

type EnvSchemaArgs = Record<string, ArraySchema>;

type GetCoreType<T> = T extends keyof EnvTypes ? EnvTypes[T] : undefined;

type GetEnvReturnType<
  Schema extends EnvSchemaArgs,
  Type extends keyof Schema
> = GetCoreType<Schema[Type][0]> extends undefined
  ? GetCoreType<Schema[Type]>
  : GetCoreType<Schema[Type][0]>;

function EnvSchema(schema: EnvSchemaArgs) {
  const requires: string[] = [];
  for (const envKey in schema) {
    const optional = Array.isArray(schema[envKey])
      ? !!schema[envKey]?.[1]?.optional
      : undefined;

    const validator = Array.isArray(schema[envKey])
      ? schema[envKey][1]?.validator
      : undefined;

    const type = (
      Array.isArray(schema[envKey]) ? schema[envKey][0] : schema[envKey]
    ).toString();

    if (!optional && !process.env[envKey]) {
      requires.push(envKey);
    }

    if (type === "number" && Number.isNaN(Number(process.env[envKey]))) {
      throw new Error(
        `Expected '${envKey}' to be a number, but got '${typeof process.env[
          envKey
        ]}'`
      );
    }
    if (
      type === "boolean" &&
      process.env[envKey] !== "true" &&
      process.env[envKey] !== "false"
    ) {
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

  return function getEnv<K extends keyof typeof schema>(
    key: K
  ): GetEnvReturnType<typeof schema, K> {
    if (schema[key] === "number")
      return Number(process.env[key.toString()]) as any;
    if (schema[key] === "string") return process.env[key.toString()] as any;
    if (schema[key] === "boolean")
      return (process.env[key.toString()] === "true" ? true : false) as any;
    return undefined as any;
  };
}

export { EnvSchema };
