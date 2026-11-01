# CodeFlow

**Execution-first learning for C Programming, HTML, CSS and JavaScript.**

CodeFlow is a static, framework-free learning app for beginner programmers, built with KTU Computer Science students in mind. Read a lesson, step through what the program does, predict its output, then check understanding with a quiz and an adaptive practice loop.

**Live site:** https://codeflow-app-sigma.vercel.app
**Repository:** https://github.com/aspire488/codeflow

No framework, no runtime build step, no API keys, no tracking. Progress stays in `localStorage`.

## Content

- 73 topics: 53 C Programming, 6 HTML, 7 CSS, 7 JavaScript
- 44 quiz topics with 132 multiple-choice questions, each with an explanation
- Output-prediction questions, a Logic Quest chapter map, a curated knowledge base

## What is implemented

| Area | Status | Notes |
| --- | --- | --- |
| Shell, routing, back/forward | Working | One hash router; every screen has a URL and active nav state; unknown routes fall back |
| Lessons | Working | Real topic content, previous/next within a subject, completion persisted |
| Quiz center | Working | MCQs with explanations, scoring, retry, persistence; feeds adaptive practice |
| Output prediction | Working | Typed answers, whitespace-tolerant matching, reveal plus explanation |
| Step-by-step visualizer | Working | Authored steps, or a computed trace for a supported `for` loop |
| Flow diagram | Working | Statements parsed into decision, process and terminator nodes |
| Pointer visualization | Working | Real address-of and dereference semantics for the bundled program |
| Recursion stack | Working | Produced by evaluating `fact(n)` and recording calls and returns |
| Loop trace | Working | The loop runs; the table shows each iteration, condition and output |
| Logic Quest | Working (vertical slice) | Chapter map, XP, unlock chain, persistence; one execution-order challenge plus prediction levels |
| Logic Analyzer | Working within scope | Heuristic static analysis. Not a compiler or interpreter |
| AI Assistant | Working, rule-based | Curated knowledge base. No model, no credentials |
| Adaptive practice | Working | Recommendations from recorded right and wrong answers |
| Progress dashboard | Working | Per-subject progress, quiz history, XP, reset |
| PWA | Working | Service worker precaches the real tree, network-first navigation, real PNG icons |
| Browser tests | Working | Playwright on desktop and Pixel 5 |

## What it is not

- **Not a C interpreter.** The visualizer covers a documented subset (a `for` loop with a `printf` body, factorial recursion, one pointer demo). Everything else replays authored step data.
- **Not an LLM assistant.** The chatbot matches keywords against a knowledge base and makes no network calls.
- **Not a compiler.** The analyzer reports structure, a complexity estimate and heuristics.
- `backend/` (Python) and `electron/` are not part of the hosted product and are not covered by the tests.

## Run locally

```bash
npm install
npm run dev        # Vite dev server
npm run serve      # or: static server on http://127.0.0.1:4173
```

## Testing

```bash
npm test           # structural + unit checks (node:test)
npx playwright install chromium
npm run test:e2e   # 34 browser tests: desktop 1280x800 and Pixel 5
npm run build      # static build; fails if a referenced script is missing
```

`npm test` adds regression checks for the defects that broke the previous build: every `<script src>` must exist, every route must map to a real screen element, no global function may be declared twice, every precached file must exist, and manifest icons must be real files.

## Install as a PWA

Use **Install** in Chrome or Edge, or *Add to Home Screen* on iOS. The service worker serves the shell offline after the first visit.

## Known limitations

- Computed visualization covers a narrow subset of C and otherwise falls back to authored steps.
- Only one Logic Quest level is a full execution challenge; the rest are prediction challenges.
- The analyzer is pattern-based and cannot prove correctness.
- The assistant is keyword-driven and says so when it has no answer.
- Accessibility had a focused pass but no formal audit.
- Performance was not benchmarked beyond build output and browser test runs.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep the vanilla stack, keep content in `data/`, and run `npm test` plus `npm run test:e2e`.

## Roadmap

1. More Logic Quest execution challenges (arrays, pointers, recursion).
2. A real tokeniser for the analyzer.
3. Author traces alongside each lesson's code.
4. Optional server-side model provider for free-form questions.

## License

MIT. See [LICENSE](LICENSE).

## Design system

`styles.css` is a single token layer - colour, typography, spacing, radius, elevation and motion are
declared once at the top - followed by one component vocabulary (`.stitch-btn`, `.stitch-card`,
`.badge`, `.filter-chip`, `.viz-panel`, `.quiz-option`, ...). Every screen is composed from those
primitives rather than from per-screen overrides.

The palette keeps the original Stitch identity: `#0d1117` canvas, `#58a6ff` accent, `#1c2026`
surfaces, Material Symbols icons. There is no CSS framework at runtime and no build step for styles.
