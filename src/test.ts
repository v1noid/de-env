import { EnvSchema } from ".";

const env = EnvSchema({
  DB_NAME: [ 'string', 'optional' ],
  DB_USER: [ 'string', 'optional' ],
  DB_PASSWORD: 'string',
  DB_SSL: 'boolean',
  DB_POOL_MIN: 'number',
  DB_POOL_MAX: 'number',
  DB_TIMEOUT: 'number',
  DB_RETRY_ATTEMPTS: 'number'
});

console.log(env("DB_SSL"));
