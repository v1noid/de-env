import { EnvConfig } from "../src";


/**env file is 
 * REDIS_URL = true
 */
// const Env = EnvConfig({
//   REDIS_URL: "boolean",
//   DB_URL: ["string",'required'],
// });



// console.log(Env("DB_URL")); // will throw an error because DB_URL is required

/**
 * env file is 
 * REDIS_URL = true
 * DB_URL = https://localhost:3000
 * PORT = 3000
 */
// const Env = EnvConfig({
//   REDIS_URL: "boolean",
//   DB_URL: "string",
//   PORT: "number",
// });

// console.log(Env("REDIS_URL")); // autmatically converted to boolean
// console.log(Env("PORT")); // autmatically converted to number

/**
 * env file is 
 * REDIS_URL = true
 * DB_URL = https://localhost:3000
 * PORT = 3000
 * 
 * running de-env command will convert env file to schema
 */
// const Env = EnvConfig({
//   REDIS_URL: "boolean",
//   DB_URL: "string",
//   PORT: "number",
// });




