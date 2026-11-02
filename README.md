# CodeFlow

<p align="center">
  <a href="https://codeflow-app-sigma.vercel.app">
    <img src="https://raw.githubusercontent.com/aspire488/aspire488/main/assets/profile/codeflow-paper.dark.svg" width="820" alt="CodeFlow — a dark execution-first programming learning workspace with a C editor, output preview and execution trace">
  </a>
</p>

<p align="center">
  <strong>Learn programming by following the execution, not memorising the syntax.</strong>
  <br>
  <a href="https://codeflow-app-sigma.vercel.app">Launch CodeFlow</a> ·
  <a href="#what-you-can-do">Explore features</a> ·
  <a href="#run-locally">Run locally</a> ·
  <a href="LICENSE">MIT License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/RELEASE-v1.1.0-238636?style=for-the-badge" alt="Release v1.1.0">
  <img src="https://img.shields.io/badge/STACK-Vanilla%20JS-f1e05a?style=for-the-badge" alt="Vanilla JavaScript">
  <img src="https://img.shields.io/badge/LICENSE-MIT-1685d4?style=for-the-badge" alt="MIT license">
</p>

---

CodeFlow is a browser-based programming learning workspace for beginners. It turns passive reading into an active loop:

<p align="center">
  <strong>CHOOSE → UNDERSTAND → PREDICT → TRACE → PRACTISE → REVIEW</strong>
</p>

It covers **C Programming, HTML, CSS and JavaScript**, with a focus on the foundations taught to early-semester computer science students.

## At a glance

| 73 topics | 132 quiz questions | 44 quiz topics | 11 screens |
|:---:|:---:|:---:|:---:|
| C · HTML · CSS · JS | Explained answers | 3 questions each | Learning workspace |

## What you can do

| Learning area | What it provides |
| --- | --- |
| **Topic explorer** | Browse 73 topics across C, HTML, CSS and JavaScript |
| **Guided lessons** | Read structured explanations and worked examples, then mark topics complete |
| **Quiz centre** | Attempt 132 explained multiple-choice questions across 44 quiz topics |
| **Output prediction** | Predict what a snippet prints before revealing the answer |
| **Visualisation studio** | Follow supported code through loop, flow, pointer and recursion visualisations |
| **Logic Quest** | Progress through a chapter map with XP, unlocks and execution/prediction challenges |
| **Logic analyser** | Inspect code with heuristic, beginner-oriented feedback |
| **Study assistant** | Search a curated programming knowledge base using a rule-based assistant |
| **Adaptive practice** | Get recommendations based on recorded correct and incorrect answers |
| **Progress dashboard** | Review subject progress, quiz history and XP |
| **Installable PWA** | Install the app and revisit its cached shell offline |

## The learning loop

1. Pick a topic from the subject explorer.
2. Learn the concept through a focused lesson and example.
3. Predict the result before revealing the answer.
4. Use a visualiser to inspect supported execution paths.
5. Test understanding with quizzes and practice.
6. Track completion and performance in the progress dashboard.

Progress is stored in the browser using `localStorage`. The hosted app does not require an account, API key or backend service.

## Built with

- **Frontend:** HTML, CSS and vanilla JavaScript.
- **Navigation:** Hash-based client-side routing.
- **Content:** Local structured lesson and quiz data.
- **Persistence:** Browser `localStorage`.
- **Offline support:** Service worker and web app manifest.
- **Quality checks:** Node's built-in test runner and Playwright.

No frontend framework and no runtime API dependency.

## Run locally

**Requirements:** Node.js and npm.

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

The static server defaults to `http://127.0.0.1:4173`.

## Test and build

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

### v1.1.0 release verification

The release was checked against the production deployment.

| Verification | Result |
| --- | ---: |
| Unit tests | **54 passed** |
| Local Playwright checks | **84 passed** |
| Production Playwright checks | **70 passed** |
| Production routes exercised | **11** |
| Console errors / failed requests in final capture | **0** |

The browser suite covered desktop and mobile workflows, themes, lessons, quizzes, visualisations, Logic Quest, the study assistant, progress and responsive layouts.

## Scope and limitations

CodeFlow is a learning aid, not a general-purpose programming runtime.

- **Visualisation is scoped.** Computed traces cover documented examples such as a supported `for` loop, factorial recursion and a pointer demonstration. Other lesson examples use authored walkthrough data.
- **The logic analyser is heuristic.** It is not a compiler, static proof engine or complete bug detector.
- **The study assistant is rule-based.** It searches a curated knowledge base; it is not an LLM and makes no model/API calls.
- **Logic Quest is a vertical slice.** It includes a chapter map, progression and challenges, not a complete game-sized curriculum.
- **Progress is browser-local.** There is no account sync or cross-device persistence.
- **The Python backend and Electron folders are not part of the hosted product** and are not covered by production browser verification.
- Automated accessibility checks are not a WCAG conformance certification. Performance has not been independently benchmarked.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep the frontend framework-free, keep learning content in the data layer, and run the unit and browser suites before submitting changes.

## License

MIT. See [LICENSE](LICENSE).

---

<p align="center">
  <sub>Built to make the logic visible. <a href="https://codeflow-app-sigma.vercel.app">Open CodeFlow ↗</a></sub>
</p>
