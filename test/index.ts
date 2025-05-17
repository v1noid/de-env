import { EnvSchema } from "de-env";

export const Env = EnvSchema({
  DB_NAME:"string",
  DB_USER:"string",
  DB_PASSWORD:"string",
  DB_SSL:"boolean",
  DB_POOL_MIN:"number",
  DB_POOL_MAX:"number",
  DB_TIMEOUT:"number",
  DB_RETRY_ATTEMPTS:"number",
});
