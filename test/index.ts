import { EnvConfig } from "../src";

const Env = EnvConfig({
  REDIS_URL: "boolean",
  DB_URL: ["string",'required'],
});



console.log(Env("DB_URL")); // will throw an error
