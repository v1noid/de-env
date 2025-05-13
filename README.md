# de-env

A simple and efficient environment variable parser that generates TypeScript/JavaScript files from your `.env` files. It automatically detects your project type (Node.js, Vite, or Bun) and generates the appropriate environment variable access code.

## What it does

`de-env` takes your `.env` file and converts it into a strongly-typed TypeScript/JavaScript module. It automatically:
- Detects numeric values and converts them
- Generates TypeScript types
- Handles comments and empty lines
- Detects duplicate keys
- Supports different module formats (ESM/CommonJS)
- Automatically detects Vite projects and uses `import.meta.env` instead of `process.env`

### Vite Support

When used in a Vite project, `de-env` automatically:
- Detects the presence of `vite.config.ts/js/mjs/cjs`
- Uses `import.meta.env` instead of `process.env`
- Generates Vite-compatible environment variable access

Example output in a Vite project:
```typescript
// env.ts
type Env = {
  readonly DB_HOST: string;
  readonly DB_PORT: number;
};

export const env: Env = {
  DB_HOST: import.meta.env.DB_HOST!,
  DB_PORT: Number(import.meta.env.DB_PORT),
};
```

### Example

Given a `.env` file:
```env
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
API_KEY="your-secret-key"
DEBUG=true
```

#### TypeScript Output (default)
Running `de-env` will generate:

```typescript
// env.ts
type Env = {
  readonly DB_HOST: string;
  readonly DB_PORT: number;
  readonly DB_NAME: string;
  readonly API_KEY: string;
  readonly DEBUG: boolean;
};

export const env: Env = {
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME!,
  API_KEY: process.env.API_KEY!,
  DEBUG: process.env.DEBUG!,
};
```

```typescript
// env.d.ts
declare const env: {
  readonly DB_HOST: string;
  readonly DB_PORT: number;
  readonly DB_NAME: string;
  readonly API_KEY: string;
  readonly DEBUG: boolean;
};

export { env };
```

#### JavaScript ESM Output
Running `de-env --output env.js` will generate:

```javascript
// env.js
export const env = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME,
  API_KEY: process.env.API_KEY,
  DEBUG: process.env.DEBUG,
};
```

```typescript
// env.d.ts
declare const env: {
  readonly DB_HOST: string;
  readonly DB_PORT: number;
  readonly DB_NAME: string;
  readonly API_KEY: string;
  readonly DEBUG: boolean;
};

export { env };
```

#### CommonJS Output
Running `de-env --commonjs` will generate:

```javascript
// env.js
module.exports = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME,
  API_KEY: process.env.API_KEY,
  DEBUG: process.env.DEBUG,
};
```

```typescript
// env.d.ts
declare const env: {
  readonly DB_HOST: string;
  readonly DB_PORT: number;
  readonly DB_NAME: string;
  readonly API_KEY: string;
  readonly DEBUG: boolean;
};

export { env };
```

Now you can use your environment variables with full TypeScript support:

```typescript
// TypeScript/ESM
import { env } from './env';

// CommonJS
const { env } = require('./env');

// TypeScript will provide autocomplete and type checking
console.log(env.DB_HOST);    // Type: string
console.log(env.DB_PORT);    // Type: number
console.log(env.API_KEY);    // Type: string
```

## Installation

```bash
npm install de-env
```

## Usage

```bash
de-env [options]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-w, --watch` | Watch the env file for changes | false |
| `-e, --env <string>` | Specify custom env file location | `.env` or `.env.local` |
| `-p, --prefix <string>` | Custom prefix for env variables | `process.env` (or `Bun.env`) |
| `-o, --output <string>` | Custom output file location | `env.ts` |
| `-c, --commonjs` | Output in CommonJS format | false (ESM by default) |

## Examples

1. Basic usage:
```bash
de-env
```

2. Watch mode for automatic updates:
```bash
de-env --watch
```

3. Custom env file location:
```bash
de-env --env ./config/.env.production
```

4. Custom prefix:
```bash
de-env --prefix Bun.env
```

5. Custom output file:
```bash
de-env --output ./src/config/env.ts
```

6. CommonJS output:
```bash
de-env --commonjs
```

## Features

- Automatically detects Vite projects and uses appropriate env prefix
- Supports TypeScript and JavaScript output
- Generates type definitions for TypeScript
- Watch mode for automatic updates
- Handles duplicate key detection
- Supports both `.env` and `.env.local` files
- Converts numeric values automatically
- Preserves comments in env files

## Output

The tool generates two files:
1. `env.ts` (or `env.js` for CommonJS) - Contains the parsed environment variables
2. `env.d.ts` (for TypeScript) - Contains type definitions

## License

MIT
