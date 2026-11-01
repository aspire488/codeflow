# Changelog

All notable changes to CodeFlow are documented here.

## [1.2.0] - 2026-11-01

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

### Removed

- Dead or duplicated modules: `screenManager.js`, `eventSystem.js`, `selfTestEngine.js`, `modules/lessons/topicRenderer.js`, `modules/game/gameMode.js`, `modules/chatbot/chatbot.js`, `ui/gameRenderer.js`, `ui/visualizationRenderer.js`, `ui/visualizationView.js`, `modules/visualization/visualizationEngine.js`, `utils/storage.js`.
- Two placeholder Vitest files that called a `visualizeCode` function that never existed.
- `docs/INTEGRATION_TEST.md` and `docs/DEPLOYMENT_SUMMARY.md`, which claimed a verified, fully functional deployment that did not exist.

### Known limitations

- The visualizer evaluates a documented subset of C, not arbitrary programs.
- One Logic Quest level is a full execution challenge; the rest are prediction challenges.
- The assistant is a curated knowledge base, not a language model.

## [1.1.0] - 2026-09-10

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
