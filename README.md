# CodeFlow

**CodeFlow is an execution-first programming-learning prototype.** It explores how program state, output, control flow, and visual feedback can become observable learning primitives instead of treating source code as static text.

> **Project status:** CodeFlow is now treated as a completed/frozen prototype. The repository has been hardened for public inspection and reproducibility; new product development is intentionally out of scope.

## 🚀 Live prototype

**Try it:** https://codeflow-app-sigma.vercel.app

The deployment is experimental and intended for learning and demonstration. It is not a general-purpose programming-language runtime.

## 🧭 Engineering model

```text
Learner
  │
  ▼
UI / Lessons / Exercises
  │
  ▼
Application State
  │
  ▼
Execution / Logic Layer
  │
  ▼
Visible State + Feedback
```

The core principle is **execution visibility**: learning interactions should expose deterministic state rather than hiding execution behind opaque output.

Experimental AI assistance remains outside the deterministic execution source of truth.

## 🧪 Final engineering baseline

- Node 22 CI/runtime baseline
- Vite 8 build baseline
- deterministic Node test suite
- production build validation
- tagged release workflow with package-version validation
- automated dependency monitoring through Dependabot
- CodeQL JavaScript analysis
- deployment security headers
- explicit prototype boundary
- architecture documentation
- MIT licensing

CI validates tests and the production build on Node 22. Security analysis runs through GitHub CodeQL.

## 🔐 Security posture

The hosted prototype is configured with defensive HTTP headers including:
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- restrictive `Permissions-Policy`

No credentials or sensitive runtime state belong in the repository.

See [`SECURITY.md`](SECURITY.md) for reporting and scope.

## 🛠️ Development

```bash
npm install
npm test
npm run build
npm run dev
```

The repository intentionally keeps the development surface small. The prototype is not being expanded into a production interpreter or execution platform.

## 📦 Release model

Releases use vX.Y.Z tags. The release workflow validates the tag against `package.json`, runs tests and the production build, and publishes the GitHub release.

See [`CHANGELOG.md`](CHANGELOG.md) for release history.

## 🤝 Contributing

Although product development is frozen, maintenance contributions remain welcome when they improve correctness, accessibility, security, reproducibility, documentation, or dependency hygiene.

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## 📜 License

CodeFlow is released under the **MIT License**. See [`LICENSE`](LICENSE).

The MIT License is the OSI-approved license identified by SPDX as `MIT`. citeturn0search3