# CodeFlow engineering model

CodeFlow is an educational prototype whose core goal is to make program execution understandable and inspectable.

## Architecture

```text
User input
   |
   v
UI / learning modules
   |
   v
Core event + routing layer
   |
   +----> execution / teaching engines
   |
   +----> deterministic state transitions
   |
   v
Visualization + feedback
```

The architecture deliberately separates presentation, orchestration, execution behavior, and rendering so individual teaching experiences can evolve without rewriting the whole application.

## Engineering principles

1. **Deterministic first** — the same supported example should produce the same state transition and output.
2. **Observable execution** — teaching value comes from showing what the program did, not only displaying source code.
3. **Explicit boundaries** — unsupported language constructs should be rejected or marked unsupported rather than silently misinterpreted.
4. **Test before expansion** — new execution constructs should arrive with unit coverage before they become part of the public learning surface.
5. **AI is bounded** — experimental AI assistance can explain or guide, but it should not silently become the execution engine.

## Current validation

The repository has a lightweight Node-based smoke test and a production build check in GitHub Actions. These are intentionally cheap enough to run on every change.

For future execution work, the preferred test layers are:

- **Unit:** parser / AST nodes / state transitions
- **Integration:** execution engine → visualization state
- **Browser:** critical learner journeys
- **Build:** production bundle generation

## AST execution roadmap

The next architectural step is a small AST-backed intermediate representation for the subset of examples CodeFlow teaches. The first supported constructs should be deliberately narrow:

- variable assignment
- numeric/string literals
- arithmetic expressions
- output statements
- bounded loops
- explicit unsupported-syntax errors

This is **not** intended to become a general Python or JavaScript interpreter. The purpose is predictable educational execution with an inspectable intermediate representation.

## Prototype boundary

CodeFlow should remain honest about what it is: an execution-visualization and programming-learning prototype. Correctness, testability, accessibility, and understandable behavior take priority over adding a large number of language features.
