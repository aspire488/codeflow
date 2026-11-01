# CodeFlow visual design research

Research checked 1 November 2026. This is a pattern board, not a request to copy another product. The live CodeFlow app remains the source of truth for content, supported interactions, and saved progress.

## Direction for CodeFlow

Keep the dark `#0d1117` canvas, blue action color, Inter, Material Symbols, and the existing left navigation. Organize overview screens as a responsive editorial grid: a primary learning action, compact real metrics, and subject or activity groups. Keep reading screens narrower than dashboards. Put controls beside the code or data they affect. Make empty states explain and launch the first useful action. Use restrained borders, surfaces, and one meaningful accent; omit charts, activity history, streaks, or awards unless the application actually records them. On phones, stack the primary action before summaries and move navigation into the existing drawer.

## Relevant examples inspected

| Example | Source | Pattern observed | Application to CodeFlow |
|---|---|---|---|
| Codecademy dashboard update | [Codecademy Help](https://help.codecademy.com/hc/en-us/articles/1260801844089-Updates-to-your-Dashboard) | Resume the latest course, then show targets and recommendations; separate Dashboard from My Learning. | Make “continue” the primary action, with discovery and stats below. Avoid weekly targets because CodeFlow does not track time or weeks. |
| Codecademy new dashboard | [Codecademy](https://www.codecademy.com/resources/blog/the-new-dashboard) | In-progress and completed courses are distinct and resumable; progress sits beside a direct Continue action. | Use actual completion state and attach next steps to subject/topic progress. |
| Khan Academy student progress | [Khan Academy Help](https://support.khanacademy.org/hc/en-us/articles/360032987591-How-can-I-understand-my-progress-in-Khan-Academy) | Mastery report pairs activity totals with an activity log; progress changes can reflect prerequisites. | Make scores and completed topics traceable to saved actions. Do not imitate activity minutes or prerequisite mastery without data. |
| Student Dashboard UI – EdTech | [Teesha Rathore, Dribbble](https://dribbble.com/shots/26098296-Student-Dashboard-UI-EdTech-Platform) | Personalized overview groups progress with upcoming work and accessibility-aware themes. | Pair completion with an immediately actionable next lesson; no leaderboard in a private single-user app. |
| Learning Dashboard UI | [Juice Lab, Dribbble](https://dribbble.com/shots/27052532-Learning-Dashboard-UI) | Calm overview balances completion, activity, and a next milestone without making analytics feel dominant. | Keep the overview encouraging, but use only persisted scores and topic completions. |
| Learning Dashboard | [Sarand Kadriu, Dribbble](https://dribbble.com/shots/26508137-Learning-Dashboard-UI-Design) | Clear sidebar, current learning status, and explicit in-progress/completed modules. | Preserve stable navigation and show subject-level completion with clear counts. |
| LMS Dark Dashboard | [Habib, Dribbble](https://dribbble.com/shots/26438603-Learning-Management-System-Dark-Dashboard) | Dark surfaces, grouped course cards, and category color as a scan cue. | Use neutral cards and blue completion cues; reject the unrelated purple/gold category palette and decorative gradients. |
| Mobile e-learning dashboard | [Kyle Dekker, Dribbble](https://dribbble.com/shots/7145092-e-Learning-Student-Mobile-App-Dashboard-Interface) | Mobile home prioritizes recently visited courses, progress, and schedules. | On mobile, put Continue first and stack compact subject cards; no schedule is invented. |
| Learning progress mobile app | [Imran Jakir / Kites Design, Dribbble](https://dribbble.com/shots/26777686-Learning-Progress-App-UI-Modern-EdTech-Mobile-App-Design) | Progress categories and time-series insights are visually distinct on a small screen. | Keep category progress distinct and responsive; omit time-based charts because CodeFlow has no session-duration data. |
| Dashboard composition | [shadcn/ui dashboard-01](https://ui.shadcn.com/blocks?category=dashboard) | Sidebar, summary cards, chart, and table are separate composable regions, with compact spacing and repeated component rules. | Use a reusable content grid and a real quiz table; no charts without a meaningful data series. Do not add React/shadcn dependencies to this vanilla app. |
| Dashboard insights | [Linear Docs](https://linear.app/docs/dashboards) | Metrics, charts, and tables are inspectable and filterable; overview and detail coexist. | Keep quiz scores linked to their lesson/retake actions instead of presenting anonymous totals. |
| Developer workspace | [CodeSandbox Web Interface](https://codesandbox.stream/docs/learn/editors/web-interface) | Tool rail, editor, and preview/support panels have clear, persistent roles. | Keep visualization code, controls, and result panels distinct; preserve mobile stacking and sticky transport. |
| Watermelon dashboard templates | [Watermelon UI](https://ui.watermelon.sh/dashboards) and [Medesk Dashboard](https://ui.watermelon.sh/dashboard/medesk-dashboard) | Full-page dashboard references organize operational modules in a consistent grid and document light/dark support. | Borrow consistent panel rhythm and explicit theme tokens, not its framework or domain-specific metrics. |
| SaaS dashboard examples | [SaaSFrame](https://www.saasframe.io/blog/saas-dashboard-design-examples?32cf5f74_page=2) | Resend uses restraint; Routine explains an empty state with a checklist; Cloudflare and Pitch orient new and returning users. | Keep real learning actions dominant; empty state is a first-lesson invitation and must never show fake activity. |
| Dialog and focus patterns | [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) | Labeled dialogs, focus trap, Escape handling, and focus restoration are expected behavior. | Preserve native/vanilla implementation and verify keyboard behavior rather than adding a React primitive. |

## Reference patterns not adopted

- Leaderboards, mentor cards, streaks, calendars, XP projections, and activity timelines from concept screens: CodeFlow has no corresponding source data or social system.
- Arbitrary charts and stat grids: only use when they answer a learning question and are derived from saved data.
- Heavy gradients, glass surfaces, neon, oversized corner radii, or 3D/scroll animation: visually loud and poorly matched to CodeFlow's focused developer-learning product.
- Copying React/Tailwind component code from Watermelon, shadcn, Magic UI, Aceternity, or 21st.dev: these examples informed layout and state patterns; the current lightweight vanilla architecture is sufficient.

## Access notes

Direct browsing worked for Awwwards, Dribbble, Land-book, Mobbin, SaaSFrame, Watermelon UI, 21st.dev, Magic UI, Aceternity UI, shadcn/ui, and Radix. Pinterest returned 403; Behance returned 403; Godly redirected to an inaccessible `recent.design`; Refero had no readable page content; Page Flows and Screenlane returned 403. Those pages are not represented as inspected examples. No login-gated screen set was used as a source.
