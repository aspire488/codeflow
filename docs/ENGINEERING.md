# CodeFlow engineering notes

## Shape of the application

Classic browser scripts, loaded in dependency order from `index.html`. There is
no bundler at runtime and no module system; each file attaches functions to the
global scope that later files call. That is a deliberate constraint of the
project, and it makes load order and unique names part of correctness.

```
data/*.js          content only (topics, quizzes, predictions, quest, knowledge base)
src/core/          syntaxHighlighter, router, app (state, delegation, modal, boot)
src/engines/       visualization, output prediction, analyzer, logic quest, adaptive practice, quiz helpers
src/ui/            one renderer per screen
scripts/           static build (copies the tree, verifies script paths)
tests/             structural + unit (node:test) and browser (Playwright)
```

### Load order

1. `data/*` - defines `TOPICS_DB`, `QUIZ_DB`, `outputPredictionDB`, `GAME_LEVELS`, `KNOWLEDGE_BASE`, `LOGIC_QUEST_LEVELS`/`LOGIC_QUEST_MAP`.
2. `src/core/syntaxHighlighter.js` - `highlightCode` is used by every renderer.
3. `src/engines/*` - expose pure logic and screen renderers (`renderVisualizer`, `renderOutputPrediction`, `renderLogicQuestMap`, `analyzeCodeLogic`, `AdaptiveEngine`).
4. `src/ui/*` - one renderer per screen; they consume data and engines.
5. `src/core/router.js` - route table mapping route names to screen ids and renderers.
6. `src/core/app.js` - `AppState`, persistence, delegated events, modal lifecycle, single bootstrap. Must load last.

## Invariants enforced by tests

- Every `<script src>` in `index.html` exists on disk.
- Every `screen:` id in the router exists in `index.html`.
- No `function name()` is declared twice across `src/`.
- Every file in the service worker precache list exists.
- Manifest icons are real files, not data URIs.
- Only one component owns each responsibility: one router, one click delegation,
  one `escapeHtml`, one `renderVisualization` path.

## State and storage

`AppState` (`xp`, `streak`, `completedTopics`, `quizScores`, `currentTopic`) is
persisted to `codeflow_app_state`. `sanitizeState` validates every field on load:
non-numeric XP becomes 0, non-array topics become `[]`, quiz scores are clamped
to their total, and unreadable JSON is discarded with defaults restored.
`AdaptiveEngine` and Logic Quest keep their own keys and validate independently.

## Visualization honesty

Two mechanisms, never mixed silently:

1. **Authored steps** - `topic.visualizationSteps` written for the lesson.
2. **Computed traces** - `traceLoop` parses start/condition/update and actually
   runs the loop (bounded to 50 iterations) to produce iterations and output;
   `traceRecursion` evaluates `fact(n)` and records calls and returns;
   `buildFlowchart` classifies statements structurally; the pointer mode models
   `&x` and `*p` for one bundled program.

When a snippet is outside that subset, the UI says so and points at a supported
example. It never pretends to interpret arbitrary C.

## Scroll and modal lifecycle

- `html, body { overflow: hidden }`; each `.screen` owns a `.screen-scroll`.
- `openModal` sets `aria-hidden="false"`, locks scroll, focuses the panel and
  remembers the trigger. `closeModal` reverses all three and restores focus.
- Escape and backdrop clicks close the dialog; the overlay uses
  `visibility: hidden; pointer-events: none` when inactive so it can never
  intercept clicks (this was the original "stuck blur" bug).
- The mobile drawer sits above its backdrop (`z-index 40` vs `35`) so the
  backdrop cannot swallow navigation clicks.

## Known constraints

- Global namespace: name collisions are a real hazard, hence the duplicate-declaration test.
- The analyzer is heuristic pattern matching, not a parser.
- `backend/` and `electron/` are outside the web app and untested here.

## Syntax highlighting

`src/core/syntaxHighlighter.js` scans source once and escapes each plain chunk before wrapping
tokens in `<span class="tok-*">`. The earlier implementation chained `.replace()` calls over the
already-generated HTML, which matched inside its own attributes and corrupted the output. Any future
language support must extend the tokeniser, not add another regex pass over emitted markup.

## Test suites

| Command | What it proves |
| --- | --- |
| `npm test` | Pure logic in a vm context, asset/route integrity, highlighter regressions |
| `npm run test:e2e` | 34 browser journeys on desktop and mobile viewports |
| `npm run test:qa` | 16 persona-level workflows, adversarial input, storage recovery and a nine-viewport matrix |
| `node scripts/screenshots.cjs [dir]` | 36 screenshots plus a console-error log for visual review |

The QA suite builds a fresh browser context per persona, so one persona's localStorage can
never contaminate another. Clipping is measured from `scrollWidth` rather than inferred from
`overflow-x: hidden`, so hidden overflow still fails the check.
