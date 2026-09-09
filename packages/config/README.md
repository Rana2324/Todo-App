# packages/config

Shared tooling configurations for the monorepo.

## Contents

- **`typescript/base.json`**: Base TypeScript compiler options shared across apps and packages.
- **`eslint/`**: Shared ESLint rules across apps (future extension).
- **`tailwind/`**: Shared Tailwind CSS presets/themes (future extension).

## Usage

In any application or package `tsconfig.json`:
```json
{
  "extends": "../../packages/config/typescript/base.json",
  "compilerOptions": {
    ...
  }
}
```
