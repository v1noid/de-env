

<div align="center">
  <a href="https://de-env.v1noid.com"><img src="https://de-env.v1noid.com/logo.png" alt="de-env" width="100"/></a>
  
  [![npm](https://img.shields.io/npm/dt/de-env.svg)](https://www.npmjs.com/package/de-env)
  [![GitHub stars](https://img.shields.io/github/stars/v1noid/de-env.svg)](https://github.com/v1noid/de-env/stargazers)
</div>

# de-env

A simple and efficient environment variable parser that generates TypeScript/JavaScript files from your environment variables using a schema-based approach.

Visit our official website: [de-env.v1noid.com](https://de-env.v1noid.com)

## What it does

`de-env` takes your environment variables and converts them into a strongly-typed TypeScript/JavaScript module using a schema definition. It helps your project validate environment variables in two ways:

1. **Manual Schema Definition**: Define your environment variable types and requirements explicitly
2. **Automatic Schema Generation**: Use `de-env <env-path> <output-path>` command to automatically generate a schema from your `.env` file

### Key Features
- Generates a schema from your environment variables
- Handles type casting (string, number, boolean)
- Supports optional fields validation using `#!` prefix in `.env`
- Supports different module formats (ESM/CommonJS)
- Automatic TypeScript type generation for better debugging

### Example

Given environment variables:
```bash
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
#!
API_KEY="your-secret-key"  # Using #! marks this as optional
DEBUG=true
```

You can also use optional block

```bash
# starting of optional block with #!!!
#!!!
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
API_KEY="your-secret-key"
DEBUG=true
#---
# use #--- to end the block
```

Now all the variable in between the comment are marked as optional

```typescript
import { EnvSchema } from "de-env";

export const Env = EnvSchema({
  DB_HOST: ["string", "optional"],
  DB_PORT: ["number", "optional"],
  DB_NAME: ["string", "optional"],
  API_KEY: ["string", "optional"],
  DEBUG: ["string", "optional"]
});
```

#### Automatic Schema Generation
Running `de-env .env config.env.ts` will automatically generate:

```typescript
// config.env.ts
import { EnvSchema } from "de-env";

export const Env = EnvSchema({
  DB_HOST: "string",
  DB_PORT: "number",
  DB_NAME: "string",
  API_KEY: ["string", "optional"], // Automatically marked as optional due to #!
  DEBUG: "boolean"
});
```

#### Manual Schema Definition
You can also manually define your schema:

```typescript
// config.env.ts
import { EnvSchema } from "de-env";

export const Env = EnvSchema({
  DB_HOST: "string",
  DB_PORT: "number",
  DB_NAME: ["string", "optional"], // Mark as optional
  API_KEY: ["string", "optional"], // Mark as optional
  DEBUG: "boolean"
});
```

Now you can use your environment variables with full TypeScript support:

```typescript
import Env from './config';

// TypeScript will provide autocomplete and type checking
console.log(Env("DB_HOST" /* Because of typescript
you will get the keys suggestion here */));    // Type: string
console.log(Env("DB_PORT"));    // Type: number
console.log(Env("API_KEY"));    // Type: string
console.log(Env("DEBUG"));      // Type: boolean

// Will throw an error if DB_NAME is not set in environment variables
console.log(Env("DB_NAME"));    // Type: string
```

## Installation

```bash
npm install de-env
```

## Usage

### Automatic Schema Generation
Using cli tool to generate
```bash
de-env <env-path> <output-path>
```

## Schema Types

The schema supports the following types:
- `"string"` - String values
- `"number"` - Numeric values (automatically converted)
- `"boolean"` - Boolean values (automatically converted)

You can mark fields as optional in two ways:
1. Using `#!` prefix in your `.env` file:
```bash
#!
optional_VAR=value
```

2. Using an array with "optional" in your schema:
```typescript
{
  optional_FIELD: ["string", "optional"],
  OPTIONAL_FIELD: "string"
}
```

## Features

- Automatic schema generation from environment variables using `de-env`
- Manual schema definition for fine-grained control
- Automatic type casting based on schema
- optional field validation (using `#!` or schema definition)
- TypeScript support with full type inference
- Automatic type generation for better debugging

## Workflow

1. Set up your environment variables (use `#!` prefix for optional variables)
2. Run `de-env config.ts` to automatically generate the schema or manually write schema
4. Use the `Env` function in your code with full type safety

## License

MIT
