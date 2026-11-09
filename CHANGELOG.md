# Changelog

All notable changes to CodeFlow are documented here.

## [1.1.0] - 2026-11-01

Rebuilt and refined; deployment verification is separate.

### Fixed

- **Fatal parse errors** in `src/core/app.js`, `src/engines/visualizationEngine.js` and `src/ui/visualizationRenderer.js` that prevented the bootstrap and the visualizer from loading.
- **Duplicate global namespaces**: three competing `showScreen`/`navigateTo`/`initRouter` implementations and four `renderVisualization` definitions shadowed each other depending on load order. One router and one component per responsibility now.
- **Unreachable screens**: the router mapped `visualize` and `logic` to element ids that did not exist, so both fell back to the dashboard. The route table and DOM ids are now checked by tests.
- **Data-shape mismatch**: the dashboard read `TOPICS_DB.topics` and the quiz read `QUIZ_DB.quizzes`; neither existed, so users saw invented fallback topics and a hardcoded sample quiz. All renderers now use the real keyed shape.
- **`AppState` was never defined**, so lesson, quiz and progress code threw on first use.
- **Service worker install always failed** because it precached root-level paths (`/app.js`, `/router.js`...) that live under `src/`. It now precaches the real tree, tolerates individual failures, and is network-first for navigations so deploys are not served stale.
- **Modal and scroll defects**: no modal existed in the shell, `body.modal-open` was never managed, and the mobile backdrop covered the navigation drawer.
- **Fabricated UI**: the game reported a hardcoded "Level 12 / 12,450 XP", test results were `Math.random()`, and memory addresses were random. Removed.

### Added

- Topic explorer, adaptive practice screen and progress dashboard.
- Flow diagram, pointer, recursion-stack and loop-trace visualizations driven by real computation where the subset allows.
- Logic Quest chapter map with XP, unlock chain, persistence and an action-by-action execution challenge that rejects incorrect execution order.
- Modal lifecycle helper (open/close, Escape, backdrop, scroll lock, focus restore).
- Playwright browser suite (desktop + Pixel 5) and structural/unit tests.
- Static build script that fails if a referenced script is missing from the artifact.
- Real PNG app icons for PWA install.

### Content

- Fixed wrong quiz answer keys and output-prediction answers, examples that did not compile, and undefined behaviour in format specifiers.
- Output-prediction snippets and C lessons are verified by compiling with gcc.

### Visualizer

- Each view is labelled as an authored walkthrough or a computed trace.
- The loop trace refuses programs it cannot model instead of guessing.
- The call stack pops frames as they return.
- Arrow keys and R work in all stepped modes. Autoplay stops when you leave the view. The transport stays reachable on phones.
- Authored walkthroughs gain line highlighting and step-by-step output.

### Behaviour

- The Logic Analyzer no longer shows always-empty complexity and findings cards, and says it does not check for bugs.
- Subject filters work.
- XP is awarded only for the first quiz pass and the first unrevealed correct prediction. The best quiz score is kept.
- State syncs across tabs. Failed saves warn the user.
- Malformed routes are handled. Continue goes to the next incomplete topic.
- The assistant is renamed Study assistant, and its suggestion chips send their message.

### Security

- Fixed a regular-expression hang in the CSS analyzer; input is capped at 10,000 characters. Analyzer output is escaped.
- Added a Content-Security-Policy.
- The service worker no longer caches failed navigation responses.
- Backend secrets are required from the environment, and Electron's open-external is limited to https. Neither is part of the hosted app.

### Accessibility

- Modal and drawer focus management. Quiz feedback is announced. Text contrast is raised. Icon text is hidden from accessible names. The active navigation item is exposed. Type is rem-based, so browser text zoom works.
- Checked with automated tests only. This is not a WCAG conformance claim.

### Design

- Refreshed shell, Dashboard (Next up from real progress), searchable Topic Explorer, lesson reading column, quiz states, visualizer workspace, Logic Quest rail map with a reachable Loops chapter, and a two-pane Logic Analyzer view.
- Progress now presents persisted course completion, quiz results, and next steps in a responsive overview; reset is behind a confirmation and separated settings disclosure.
- Added a persisted dark/light appearance toggle. Inter and Material Symbols are self-hosted and precached so the interface retains its type and icon system offline.

### Removed

- Dead or duplicated modules: `screenManager.js`, `eventSystem.js`, `selfTestEngine.js`, `modules/lessons/topicRenderer.js`, `modules/game/gameMode.js`, `modules/chatbot/chatbot.js`, `ui/gameRenderer.js`, `ui/visualizationRenderer.js`, `ui/visualizationView.js`, `modules/visualization/visualizationEngine.js`, `utils/storage.js`.
- Two placeholder Vitest files that called a `visualizeCode` function that never existed.
- `docs/INTEGRATION_TEST.md` and `docs/DEPLOYMENT_SUMMARY.md`, which claimed a verified, fully functional deployment that did not exist.
- The invented "Engineering Student" chip, dead CSS, and the unused `data/gameLevels.js`.

### Known limitations

- The visualizer evaluates a documented subset of C: authored walkthroughs, plus computed traces for simple loops and factorial recursion. It does not run arbitrary programs.
- Only the first Logic Quest level is an interactive execution challenge; the other 11 are prediction challenges.
- The assistant is rule-based: a curated knowledge base, not a language model.
- There is no general-purpose code execution.
- The analyzer explains structure and finds no bugs.
- Progress lives in one browser's localStorage.
- Flow diagrams show source order, not execution paths.
- Persona testing is AI-simulated, not real users.

## Earlier untagged work

These version numbers were used during development but never tagged or released; only v1.0.0 was.

## 1.1.0 development build (untagged) - 2026-09-10

### Added

- Execution-first programming learning prototype with visible code behavior
- Deterministic test and production-build validation in GitHub Actions
- Engineering architecture and testing documentation

## 1.3.0 - Premium UI/UX pass

### Fixed
- Syntax highlighting no longer corrupts code. The regex highlighter rewrote markup it had already
  generated, so attribute text such as `class="text-[#d73a49]"` appeared in the code block and `<`
  characters were swallowed. Replaced with a single-pass tokeniser that escapes text before wrapping it.
- Mobile drawer width was ignored by the cascade (`.stitch-sidebar.app-sidebar` outranked the media
  query), so it never reached its intended width.
- Visualizer: the 73-topic chip wall is now a grouped `<select>`, and the selector spans both grid
  columns instead of pushing the code panel into column two.
- The desktop hamburger button is hidden again (`.icon-button` had overridden `.mobile-only`).
- Lesson and quiz headers left-align instead of centring the title between a back button and meta text.
- Action buttons no longer sit flush against inputs in the quiz and output prediction screens.
- Authored walkthrough narration is no longer printed in the Output panel as if it were program stdout.

### Changed
- `styles.css` is now one token layer (colour, type, space, radius, elevation, motion) with a single
  component vocabulary, replacing the previous override stack.
- Sidebar navigation grouped into Learn / Practice / Studio / Support, with 40px touch targets.
- Removed the vendored Tailwind runtime (`tailwind.js`, ~300 KB); nothing referenced its utilities after
  the stylesheet rewrite. Service worker cache bumped to `codeflow-v4`.
- The study assistant replies synchronously; the 350ms artificial delay is gone and the screen states
  in its header that it is rule-based, not a language model.

### QA pass - defects found by simulated personas
- The off-canvas drawer stayed in the tab order while closed, so keyboard users could focus
  invisible navigation buttons. It is now `visibility: hidden` until opened.
- Dialogs had no focus trap: Tab walked out of the modal into the blocked page behind it.
  Tab and Shift+Tab now cycle inside the open dialog.
- The chat input accepted arbitrarily long pastes and would scan them against the whole
  knowledge base. Messages over 500 characters now get an explicit reply instead.
- Corrupt practice history was reported with `console.error` and left in storage, so it failed
  again on every load. It is now a warning, the key is cleared, and the app continues.
- The topic explorer kept the last subject filter when opened from the sidebar. It resets to
  "All subjects".
