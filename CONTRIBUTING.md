# Contributing to CodeFlow

Thanks for helping improve CodeFlow.

## Development

```bash
npm ci
npm test
npm run build
npm run dev
```

## Pull requests

- Keep changes focused and explain the user-facing or engineering impact.
- Add or update tests for behavior changes.
- Keep the project clearly scoped as a prototype; do not present the execution simulator as a general-purpose interpreter.
- Avoid committing API keys, generated secrets, or local environment files.

## Architecture

Prefer changes that preserve the separation between UI, feature modules, engines, state, and utilities. New execution capabilities should be implemented as testable engine logic rather than embedded directly in UI handlers.
