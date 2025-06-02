import { EnvSchema } from ".";

const env = EnvSchema({
  DB_NAME: [ 'string', 'optional' ],
  DB_USER: 'string',
  DB_PASSWORD: 'string',
  DB_SSL: 'boolean',
  DB_POOL_MIN: 'number',
  DB_POOL_MAX: 'number',
  DB_TIMEOUT: ['boolean','optional'],
  DB_RETRY_ATTEMPTS: 'undefined'
});

console.log(env("DB_TIMEOUT"));
