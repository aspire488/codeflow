<p align="center">
<img src="https://raw.githubusercontent.com/aspire488/codeflow/main/docs/codeflow-architecture.svg" alt="CodeFlow architecture" width="100%"/>
</p>

<p align="center">
<a href="https://codeflow-app-sigma.vercel.app"><img src="https://img.shields.io/badge/Live%20Preview-Open-green?style=for-the-badge" alt="Live preview"/></a>
<img src="https://img.shields.io/badge/Status-Prototype-orange?style=for-the-badge" alt="Prototype"/>
<img src="https://img.shields.io/badge/CI-GitHub%20Actions-success?style=for-the-badge" alt="CI"/>
<img src="https://img.shields.io/github/license/aspire488/codeflow?style=for-the-badge" alt="MIT License"/>
</p>

# CodeFlow

**CodeFlow is an execution-first programming-learning prototype.** Instead of treating code as static text, it explores how execution state, output, control flow, and visual feedback can be made observable for learners.

## 🚀 Live prototype

**Try it:** https://codeflow-app-sigma.vercel.app

The live build is experimental and intended for learning/demo use.

## 🧪 Engineering status

> **Prototype** — actively being hardened for public development. CodeFlow is an educational execution environment, not a general-purpose programming language runtime.

Current engineering baseline:

- Node-based deterministic test suite
- Production build validation in GitHub Actions
- Node 20 CI environment
- Explicit architecture documentation
- Bounded experimental AI assistance
- AST-backed execution tracked as the next major execution milestone

## 🏗️ Architecture

```text
┌─────────────────────────────────────┐
│              UI / UX                │
│ lessons · quizzes · visual tracing  │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│          Application Modules         │
│ state · exercises · learning flows  │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│         Execution / Logic Layer     │
│ deterministic state + output model  │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│             Renderer                │
│ visible execution + feedback        │
└─────────────────────────────────────┘

Optional AI assistance remains outside the deterministic execution source of truth.
```

See [`docs/codeflow-architecture.svg`](docs/codeflow-architecture.svg) for the visual architecture.

## 🛠️ Engineering focus

- **Execution visibility** — make program state understandable rather than opaque.
- **Deterministic behavior** — learning interactions should be reproducible.
- **Testable modules** — isolate execution and UI behavior so features can evolve safely.
- **Bounded AI** — AI can assist learning, but it should not silently define execution state.
- **Incremental language support** — expand the supported subset deliberately instead of pretending to implement a full language.

## 🔭 Roadmap

- [ ] AST-backed intermediate representation
- [ ] Browser-level regression suite
- [ ] More control-flow constructs
- [ ] Better execution visualizations
- [ ] Expanded educational content

## 🤝 Development

```bash
npm install
npm test
npm run build
npm run dev
```

CI validates the test suite and production build on Node 20. Dependabot monitors npm and GitHub Actions dependencies weekly.

## 📌 Related engineering work

- [Issue #18 — AST-backed execution model](https://github.com/aspire488/codeflow/issues/18)
- [PR #17 — Public-development hardening](https://github.com/aspire488/codeflow/pull/17)
- [PR #19 — Engineering architecture/testing model](https://github.com/aspire488/codeflow/pull/19)

## 📄 License

MIT