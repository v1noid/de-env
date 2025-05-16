# de-env

A simple and efficient environment variable parser that generates TypeScript/JavaScript files from your environment variables using a schema-based approach.

## What it does

`de-env` takes your environment variables and converts them into a strongly-typed TypeScript/JavaScript module using a schema definition. It helps your project validate environment variables in two ways:

1. **Manual Schema Definition**: Define your environment variable types and requirements explicitly
2. **Automatic Schema Generation**: Use `de-env <env-path> <output-path>` command to automatically generate a schema from your `.env` file

### Key Features
- Generates a schema from your environment variables
- Handles type casting (string, number, boolean)
- Supports required fields validation using `#!` prefix in `.env`
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
API_KEY="your-secret-key"  # Using #! marks this as required
DEBUG=true
```

You can also use required block

```bash
# starting of required block with #!!!
#!!!
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
API_KEY="your-secret-key"
DEBUG=true
#---
# use #--- to end the block
```

Now all the variable in between the comment are marked as required

```typescript
import { EnvConfig } from "de-env";

export const Env = EnvConfig({
  DB_HOST: ["string", "required"],
  DB_PORT: ["number", "required"],
  DB_NAME: ["string", "required"],
  API_KEY: ["string", "required"],
  DEBUG: ["string", "required"]
});
```

#### Automatic Schema Generation
Running `de-env .env config.env.ts` will automatically generate:

```typescript
// config.env.ts
import { EnvConfig } from "de-env";

export const Env = EnvConfig({
  DB_HOST: "string",
  DB_PORT: "number",
  DB_NAME: "string",
  API_KEY: ["string", "required"], // Automatically marked as required due to #!
  DEBUG: "boolean"
});
```

#### Manual Schema Definition
You can also manually define your schema:

```typescript
// config.env.ts
import { EnvConfig } from "de-env";

export const Env = EnvConfig({
  DB_HOST: "string",
  DB_PORT: "number",
  DB_NAME: ["string", "required"], // Mark as required
  API_KEY: ["string", "required"], // Mark as required
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

You can mark fields as required in two ways:
1. Using `#!` prefix in your `.env` file:
```bash
#!
REQUIRED_VAR=value
```

2. Using an array with "required" in your schema:
```typescript
{
  REQUIRED_FIELD: ["string", "required"],
  OPTIONAL_FIELD: "string"
}
```

## Features

- Automatic schema generation from environment variables using `de-env`
- Manual schema definition for fine-grained control
- Automatic type casting based on schema
- Required field validation (using `#!` or schema definition)
- TypeScript support with full type inference
- Automatic type generation for better debugging

## Workflow

1. Set up your environment variables (use `#!` prefix for required variables)
2. Run `de-env config.ts` to automatically generate the schema or manually write schema
4. Use the `Env` function in your code with full type safety

## License

MIT
