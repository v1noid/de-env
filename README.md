# de-env

A simple and efficient environment variable parser that generates TypeScript/JavaScript files from your environment variables using a schema-based approach.

## What it does

`de-env` takes your environment variables and converts them into a strongly-typed TypeScript/JavaScript module using a schema definition. It automatically:
- Generates a schema from your environment variables
- Handles type casting (string, number, boolean)
- Supports required fields validation
- Supports different module formats (ESM/CommonJS)

### Example

Given environment variables:
```bash
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
API_KEY="your-secret-key"
DEBUG=true
```

#### Automatic Schema Generation
Running `de-env config.ts` will automatically generate:

```typescript
// config.ts
import { EnvConfig } from "de-env";

const Env = EnvConfig({
  DB_HOST: "string",
  DB_PORT: "number",
  DB_NAME: "string",
  API_KEY: "string",
  DEBUG: "boolean"
});

export default Env;
```

You can then modify the schema to add required fields:

```typescript
// config.ts
import { EnvConfig } from "de-env";

const Env = EnvConfig({
  DB_HOST: "string",
  DB_PORT: "number",
  DB_NAME: ["string", "required"], // Mark as required
  API_KEY: ["string", "required"], // Mark as required
  DEBUG: "boolean"
});

export default Env;
```

Now you can use your environment variables with full TypeScript support:

```typescript
import Env from './config';

// TypeScript will provide autocomplete and type checking
console.log(Env("DB_HOST"));    // Type: string
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

```bash
de-env <output-path>
```

### Examples

1. Basic usage:
```bash
de-env config.ts
```

2. Custom path:
```bash
de-env ./src/config/env.ts
```

## Schema Types

The schema supports the following types:
- `"string"` - String values
- `"number"` - Numeric values (automatically converted)
- `"boolean"` - Boolean values (automatically converted)

You can mark fields as required by using an array with "required":
```typescript
{
  REQUIRED_FIELD: ["string", "required"],
  OPTIONAL_FIELD: "string"
}
```

## Features

- Automatic schema generation from environment variables
- Automatic type casting based on schema
- Required field validation (user-defined)
- TypeScript support with full type inference
- Simple and intuitive API

## Workflow

1. Set up your environment variables
2. Run `de-env config.ts` to automatically generate the schema
3. Modify the generated schema to add required fields if needed
4. Use the `Env` function in your code with full type safety

## License

MIT
