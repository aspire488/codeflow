# CodeFlow

<p align="center">
  <strong>Learn programming by following the execution, not memorising the syntax.</strong>
  <br>
  <a href="https://codeflow-app-sigma.vercel.app">Live app</a> ·
  <a href="https://github.com/aspire488/codeflow">Source</a> ·
  <a href="LICENSE">MIT License</a>
</p>

CodeFlow is a browser-based programming learning platform for beginners, built around an execution-first loop:

**Choose a topic → understand an example → predict the output → trace the logic → practise → review progress.**

It covers C Programming, HTML, CSS and JavaScript. The content and interface are designed for self-paced learning, with a particular focus on the foundations taught to early-semester computer science students.

<p align="center">
  <a href="https://codeflow-app-sigma.vercel.app"><img src="https://img.shields.io/badge/Live-v1.1.0-238636?style=for-the-badge" alt="Live version 1.1.0"></a>
  <img src="https://img.shields.io/badge/Stack-Vanilla%20JS-f1e05a?style=for-the-badge" alt="Vanilla JavaScript">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT license">
</p>

## What you can do

| Learning area | What it provides |
| --- | --- |
| Topic explorer | Browse 73 topics across C, HTML, CSS and JavaScript |
| Guided lessons | Read structured explanations and worked examples, then mark topics complete |
| Quiz centre | Attempt 132 explained multiple-choice questions across 44 quiz topics |
| Output prediction | Work out what a snippet prints before revealing the answer |
| Visualisation studio | Follow supported code through loop, flow, pointer and recursion visualisations |
| Logic Quest | Progress through a chapter map with XP, unlocks and execution/prediction challenges |
| Logic analyser | Inspect code with heuristic, beginner-oriented feedback |
| Study assistant | Search a curated programming knowledge base using a rule-based assistant |
| Adaptive practice | Get practice recommendations based on recorded correct and incorrect answers |
| Progress dashboard | Review subject progress, quiz history and XP |
| Installable PWA | Install the app and revisit its cached shell offline |

## Content at a glance

- **73 topics:** 53 C Programming, 6 HTML, 7 CSS and 7 JavaScript.
- **44 quiz topics** containing **132 multiple-choice questions**, with explanations.
- Output-prediction exercises, a curated knowledge base and a Logic Quest chapter map.

## How CodeFlow works

1. Pick a topic from the subject explorer.
2. Learn the concept through a focused lesson and example.
3. Predict the result before revealing the answer.
4. Use a visualiser to inspect supported execution paths.
5. Test understanding with quizzes and practice.
6. Track completion and performance in the progress dashboard.

Progress is stored locally in the browser using `localStorage`. The hosted app does not require an account, API key or backend service.

## Technology

- HTML, CSS and vanilla JavaScript.
- Hash-based client-side routing.
- Local structured lesson and quiz data.
- Browser `localStorage` for progress.
- Service worker and web app manifest for PWA installation/offline shell support.
- Node's built-in test runner and Playwright for automated checks.

There is no frontend framework and no runtime API dependency.

## Run locally

Requirements: Node.js and npm.

```bash
git clone https://github.com/aspire488/codeflow.git
cd codeflow
npm install
npm run dev
```

For a static-server run:

```bash
npm run serve
```

The app is then served locally at the address printed by the command (the static server defaults to `http://127.0.0.1:4173`).

## Test and build

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

The automated checks cover application structure and browser workflows. Regression checks include missing script references, route-to-screen mappings, duplicate global declarations, precache file existence and manifest icon files.

### Release verification — v1.1.0

The v1.1.0 release was verified against the production deployment:

| Check | Result |
| --- | ---: |
| Unit tests | 54 passed |
| Local Playwright browser checks | 84 passed |
| Production Playwright browser checks | 70 passed |
| Production routes exercised | 11 |
| Production console errors / failed requests in final capture | 0 |

The browser suite covered desktop and mobile workflows, themes, lessons, quizzes, visualisations, Logic Quest, the study assistant, progress and responsive layouts.

## Scope and honest limitations

CodeFlow is a learning aid, not a general-purpose programming runtime.

- **Visualisation is deliberately scoped.** Computed execution traces cover documented examples such as a supported `for` loop, factorial recursion and a pointer demonstration. Other lesson examples use authored walkthrough data.
- **The logic analyser is heuristic.** It is not a compiler, static proof engine or complete bug detector.
- **The study assistant is rule-based.** It searches a curated knowledge base; it is not an LLM and does not make model/API calls.
- **Logic Quest is a vertical slice.** It includes a chapter map, progression and challenges, but not a complete game-sized curriculum.
- **Progress is browser-local.** There is no account sync or cross-device persistence.
- **The Python backend and Electron folders are not part of the hosted product.** They are not covered by the production browser verification.
- Automated accessibility checks are not a WCAG conformance certification. Performance has not been independently benchmarked.

## Project structure

```text
.
├── data/          # lesson, quiz and knowledge-base content
├── styles.css     # shared design tokens and component styles
├── scripts/       # application modules and runtime
├── tests/         # unit and structural regression tests
├── e2e/           # Playwright browser tests
├── public/        # PWA manifest, icons and static assets
└── index.html     # application entry point
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep the frontend framework-free, keep learning content in the data layer, and run the unit and browser suites before submitting changes.

## License

MIT. See [LICENSE](LICENSE).
