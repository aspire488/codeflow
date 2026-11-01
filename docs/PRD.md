# CodeFlow - Product Requirements Document

**Version:** 1.2.0
**Status:** Shipped, with documented limits

## 1. Product overview

CodeFlow teaches introductory programming by making program state visible. The learner reads a short lesson, watches execution step by step, predicts output, and is quizzed on the same concept. Performance feeds adaptive practice.

**Audience:** beginner programmers, especially KTU Computer Science students.

**Subjects:** C Programming, HTML, CSS, JavaScript.

**Deployment:** static site. No server, account, database or API key is required for any learner-facing feature.

## 2. Success criteria

A learner can, without developer intervention:

1. Reach every feature from visible navigation on phone and desktop.
2. Complete a lesson and have that completion survive a reload.
3. Take a quiz, understand each answer, and see the score in progress.
4. Step a program forwards and backwards and read variable state.
5. Play a Logic Quest level that requires reasoning about execution order.
6. Ask the assistant a question and get a knowledge-base answer.

## 3. Requirements and status

| ID | Requirement | Status |
| --- | --- | --- |
| F1 | Hash router with 11 screens, back/forward, unknown-route fallback | Implemented |
| F2 | Topic explorer filterable by subject | Implemented |
| F3 | Lesson viewer: concepts, code, line-by-line notes, exam tip, practice prompt, prev/next | Implemented |
| F4 | Quiz center: MCQ, explanations, score, retry, persistence | Implemented |
| F5 | Output prediction with whitespace-tolerant checking and reveal | Implemented |
| F6 | Step-by-step visualization with play/pause, next, back, reset | Implemented |
| F7 | Flow diagram derived from source structure | Implemented |
| F8 | Pointer visualization (address-of, dereference) | Implemented |
| F9 | Recursion call stack from a real evaluation | Implemented |
| F10 | Loop trace table from a real loop execution | Implemented |
| F11 | Logic Quest: chapter map, XP, unlocks, persistence, execution-order challenge | Implemented (vertical slice) |
| F12 | Logic Analyzer for C, JS, HTML, CSS | Implemented (heuristic) |
| F13 | Assistant screen with history, loading state, error handling | Implemented (rule-based) |
| F14 | Adaptive practice driven by recorded answers | Implemented |
| F15 | Progress dashboard with per-subject progress and reset | Implemented |
| F16 | PWA: manifest, real icons, offline shell | Implemented |
| F17 | Responsive layout from 320px without horizontal overflow | Implemented |
| F18 | Automated browser tests on desktop and mobile viewports | Implemented |
| F19 | Free-form LLM answers | Not implemented (no provider, no key) |
| F20 | General-purpose code execution | Out of scope by design |

## 4. Non-functional requirements

- **Stack:** vanilla JS/HTML/CSS. No React, Vue, Angular or Electron in the web app.
- **Footprint:** no runtime dependencies; only Inter and Material Symbols load from Google Fonts.
- **Resilience:** corrupted `localStorage` must not prevent startup; malformed fields are discarded and defaults restored.
- **Security:** interpolated text passes through `escapeHtml`; no secrets in frontend code; the assistant makes no network calls.
- **Accessibility:** 40px minimum targets, labelled controls, Escape closes overlays, focus restored after dialogs, reduced-motion support.
- **Scroll integrity:** only the active screen scrolls; body scroll is locked only while a modal is open and always restored.

## 5. Explicit non-goals

- Compiling, interpreting or validating arbitrary C or JavaScript.
- Server-side grading of submissions.
- Accounts, cloud sync or analytics.
- Presenting the assistant as a general-purpose AI model.

## 6. Quality gates

- `npm test`: structural checks (script paths, route/screen ids, duplicate globals, precache paths, icons) plus unit tests for loop tracing, recursion, flow parsing, output normalisation, quest execution order, scoring and state sanitising.
- `npm run test:e2e`: Playwright on desktop 1280x800 and Pixel 5.
- `npm run build`: static build that fails if a referenced script is missing from the artifact.
