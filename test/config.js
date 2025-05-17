import { EnvSchema } from "de-env";

const Env = EnvSchema({
    DB_HOST: "string",
    DB_PORT: "number",
    DB_USER: "string",
    DB_PASSWORD: "string",
    DB_NAME: "string",
})

export { Env };