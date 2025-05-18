import { EnvSchema } from ".";

const env = EnvSchema({
  DB_NAME: ["string", {optional:} ]
});

console.log(env("DB_NAME"));
