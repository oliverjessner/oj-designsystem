# PineFetch and NO-BULLSHIT-RSS source analysis

Inspected on 2026-10-07. This is a source review, not a claim of a complete
runtime accessibility audit. Consumer repositories were read only.

## Source snapshots

| Repository                                                                                                                      | Commit                                     | Working copy                                      |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------- |
| [PineFetch](https://github.com/oliverjessner/PineFetch/tree/479ff04a6243c0360e60c3467c6aafbed86ff35f)                           | `479ff04a6243c0360e60c3467c6aafbed86ff35f` | `/tmp/oj-designsystem-references/PineFetch`       |
| [NO-BULLSHIT-RSS](https://github.com/oliverjessner/NO-BULLSHIT-RSS/tree/e3a6d3ec0a7a7b6944bd869b3988bcc05ed6f541)               | `e3a6d3ec0a7a7b6944bd869b3988bcc05ed6f541` | `/tmp/oj-designsystem-references/NO-BULLSHIT-RSS` |
| [PineFetch-Designsystem](https://github.com/oliverjessner/PineFetch-Designsystem/tree/2ffe3c27c2fb79825d218d4df63ae335b78ede71) | `2ffe3c27c2fb79825d218d4df63ae335b78ede71` | `/Users/oli/github/PineFetch-Designsystem`        |

The local consumer checkouts at `/Users/oli/github/PineFetch` and
`/Users/oli/github/NO-BULLSHIT-RSS` matched these commits and had clean git
status. The legacy design-system working copy also had clean git status.
Its readable CSS was used to explain the minified vendored stylesheet;
consumer files remain the authority for actual usage.

## Existing shared foundation

PineFetch declares `pinefetch-designsystem: ^0.2.0` in `package.json` and loads
`src/vendor/pinefetch.css` before `src/styles.css` in `src/index.html`.
RSS pins `pinefetch-designsystem: 0.2.0` and loads `/vendor/pinefetch.css`
before `/styles.css` in `public/index.html`. The common `pf-*` API already
demonstrates cross-product use, but its implementation should not be renamed
and carried over wholesale.

The legacy tokens in `design-system/pinefetch.css:4` provide useful evidence
for the family: near-black page (`#0a0b0f`), slightly raised surfaces
(`#11141d`, `#151a24`), one-pixel borders (`#232a3a`), light text (`#e4e8f1`),
muted text (`#9aa3b2`), 4/8/12/16/20/24px spacing, and 40px controls.
Danger (`#ff5d6c`) and warning (`#f5c36a`) already have separate meanings.
Both consumers therefore support dense dark tools, consistent native form
controls, and small functional component variants.

The legacy design also uses cyan-specific RGBA values, glowing primary
buttons and focus rings, gradient panels/backgrounds, 10–16px radii, and pill
segmented controls. These conflict with the requested calm BulkPixel-derived
direction. Its body is monospace while controls use system sans; neither
Comfortaa nor JetBrains Mono is the current shared typography.

## PineFetch findings

| Pattern                    | Source evidence                                                                                                                                                                                                                                      | Design-system decision                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation and choices     | `src/index.html:24` uses a `nav.pf-segmented` with `aria-pressed` buttons for Download/History/Browser Import/Settings.                                                                                                                              | Reusable visual navigation and segmented-choice patterns; application view switching stays in PineFetch.                                             |
| Forms and settings         | `src/index.html:61` onward uses visible labels, inputs, selects, checkbox-backed toggles, grouped fields, and output-folder input/actions. `src/settings-view.js` owns persistence.                                                                  | Share controls, field/help/validation patterns, input groups, switches and path display. Keep directory picking and settings persistence in the app. |
| Filter toolbar             | `src/index.html:115`, `src/styles.css:153` combine history search, search-field selection and source selection.                                                                                                                                      | Share wrapping toolbar, labeled controls and spacing. Keep filter values and search debounce in `src/history-view.js`.                               |
| Lists and empty states     | `src/history-view.js:160` creates `.pf-list-card` history entries with a real open button, thumbnail, metadata and actions. `src/index.html:153` provides the history empty hint.                                                                    | Share list/card surface, metadata, empty state and action styling. Keep downloaded-file actions and entry rendering local.                           |
| Metrics and key/value data | `src/index.html:407` composes `pf-panel-soft` and `pf-stat`; `src/history-details-view.js:50` creates `dt`/`dd` overview rows.                                                                                                                       | Share metric plus panel composition and definition-list styling. Keep counts, byte/duration formatting and media fields local.                       |
| Native modal and tabs      | `src/index.html:524` declares a labeled native dialog and correctly linked tabs/panels. `src/history-details-view.js:119`, `:267`, `:391` update selection, roving tab stops, panel visibility, dialog focus/return focus, Left/Right/Home/End keys. | Strong evidence for generic dialog helpers and accessible tabs. Caption/transcript fetching stays local.                                             |
| Menus                      | `src/main.js:1528` onward handles queue-menu actions and dismissal. `src/history-details-view.js:365` handles Escape and focus for the single-action history menu.                                                                                   | Share generic menu/dropdown focus and dismissal. Do not import queue operations or contextual entry state.                                           |
| Status and progress        | `src/index.html:90`, `:152`, `:159` use polite status regions. `src/main.js` renders queue status, error messages and progress.                                                                                                                      | Share semantic statuses, progress and live-region examples. Keep download job transitions local.                                                     |

No native table markup was found in this snapshot's `src` files. History is a
list/card interface; table requirements must be supported from the broader
inventory rather than described as an existing PineFetch component.

The app-specific full-height split layout (`src/styles.css:12`, `:91`),
queue-collapse/history/settings column rules, platform colors, media preview,
transcription controls, browser-import pairing, terminal content, and Tauri
integration stay outside the library. A generic log/code presentation may be
shared, but the download log's commands and meaning are domain data.

## NO-BULLSHIT-RSS findings

| Pattern                           | Source evidence                                                                                                                                                                            | Design-system decision                                                                                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Main navigation and settings tabs | `public/index.html:16`, `:249` reuse `pf-segmented`; `public/js/ui/navigation.js` switches views and updates pressed state.                                                                | Share navigation/segmented styling and generic tabs where tab semantics apply. Keep routes/view state and sticky behavior local.                                                                 |
| Search and filters                | `public/index.html:46` combines search, topic/source/list/status selects, layout choice, removable filter chips and clear action.                                                          | Share search input, toolbar, tags/filter affordances and segmented choices; filtering rules stay local. The search currently relies on a placeholder, so migration should add an explicit label. |
| Feed cards and topic/source chips | `public/js/components/article-card.js`, `chips.js` create labeled buttons, status badges, topic tags, source metadata, time elements and app actions with `textContent`.                   | Share content card, tag, badge, metadata and button styles. Article triage, topic scores, read/save/dismiss and source logos stay local.                                                         |
| Settings forms and lists          | `public/js/views/settings.js` constructs topic/rule/feed/list/blocked-word rows and native controls.                                                                                       | Share form controls, validation/help text, lists, panel/section headers and action groups. Keep classification rules, scheduler settings and JSON editing validation local.                      |
| Action menu                       | `public/index.html:33`, `:220` use native `details` with menu content; `public/js/ui/export-menu.js` handles outside pointer and Escape, returns focus and sets busy/disabled states.      | Share disclosure/dropdown and keyboard menu behavior; export formats and async export commands stay local.                                                                                       |
| Modal                             | `public/index.html:597` uses a custom backdrop with labeled `role="dialog"`, `aria-modal="true"`; `public/js/ui/modal.js:13`, `:55`, `:71` implements a local focus trap and focus return. | Replace presentation/behavior with native dialog plus helpers; keep list assignment/removal, article IDs and API calls local.                                                                    |
| Toast and empty/loading feedback  | `public/js/ui/toast.js` safely writes message text and optional undo action, replacing the previous toast after six seconds. `public/index.html:650` has a polite atomic live region.      | Share safe text-only toast, dismiss affordance and live-region behavior. Preserve application undo handlers. Share richer empty states and native progress/skeleton presentation.                |

No native table markup was found in `public/index.html`. RSS settings and
feeds use list/card structures rather than tables.

RSS's article webview, sidebar proportions, digest clustering, source-specific
metadata, semantic classification called “Bullshit”, topic-score algorithms,
list colors, and feed synchronization remain domain-specific. Its
`content-visibility`/intrinsic sizing optimization (`public/styles.css:133`)
belongs to the large feed renderer, not every generic card.

## Inconsistencies and improvements

1. **Accent derivation:** `--pf-accent` and many cyan RGBA companion values are
   independently fixed. Derive `--oj-accent-*` from one public accent token.
   RSS maps success to accent (`public/styles.css:27`); use a separate success
   token so changing product branding does not change status meaning.
2. **Duplicated token vocabularies:** RSS adds unprefixed aliases over `pf-*`
   tokens in `public/styles.css:3`. `--space-14` resolves to 12px and
   `--space-18` to 16px, making names misleading. Migrate shared styling to a
   single namespaced spacing scale and keep app layout values app-local.
3. **Interactive semantics:** the legacy segmented style is used for both
   pressed choices and ARIA tabs. Provide distinct segmented-choice and tabs
   contracts. PineFetch's history-details tabs already provide the needed
   keyboard pattern; main navigation must not inherit tab behavior blindly.
4. **Modal variation:** PineFetch uses native `dialog`; RSS manually traps
   focus on a div and its focusable selector excludes input/textarea/link
   types. A native dialog reduces local behavior maintenance.
5. **Menu variation:** RSS menu content uses menu roles but its export binder
   has no Arrow/Home/End navigation. PineFetch's queue menu lacks a complete
   menu role contract. Supply one generic keyboard implementation.
6. **Motion:** PineFetch's reduced-motion rule (`src/styles.css:820`) only
   addresses shake/indeterminate progress. RSS's rule
   (`public/styles.css:2400`) only disables viewer reveal while fade, spinner
   and hover transforms remain. Shared components need comprehensive reduced
   motion, while consumers should review their own animations.
7. **Icons:** visible `×`, `•••`, and external-link arrows are used as controls
   (`src/index.html:537`, `public/index.html:33`,
   `public/js/components/digest-cluster.js:34`). Use Font Awesome with hidden
   decorative glyphs and explicit icon-button labels; keep logos as assets.
8. **Global side effects:** the existing DS globally sets body typography and
   a radial background. Keep reusable component styles scoped and make base
   presentation opt-in through the library's documented root/shell classes.

## Migration candidates

| Existing contract                                                         | New reusable contract                                            |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `pf-btn`, primary/ghost/danger, `pf-icon-btn`                             | `oj-button` variants and `oj-icon-button`                        |
| `pf-input`, `pf-select`, `pf-textarea`, `pf-field`, `pf-label`, `pf-hint` | Native `oj-*` controls, field/label/helper and validation states |
| `pf-toggle` with native checkbox                                          | Accessible `oj-switch`                                           |
| `pf-panel`, `pf-panel-soft`, `pf-panel-header`                            | `oj-panel` variants, `oj-section-header`                         |
| `pf-stack`, `pf-row`, `pf-toolbar`, `pf-field-row`, `pf-grid`             | Stack/inline/cluster/grid/toolbar/input-group primitives         |
| `pf-segmented`                                                            | `oj-segmented` for choices; `oj-tabs` for labeled tab panels     |
| `pf-badge`, status classes                                                | Semantic `oj-badge`, `oj-status`, `oj-alert`                     |
| `pf-stat`, overview `dl`                                                  | `oj-metric`/metric card and key/value or definition list         |
| `pf-list-card`, RSS card/chip presentation                                | Generic interactive list, content card, `oj-tag`                 |
| Native/custom modal presentation                                          | `oj-dialog` and dialog helpers                                   |
| Local menu and toast behavior                                             | `initDropdowns`, menu keyboard behavior and safe `toast`         |

Migration should replace shared components incrementally, remove the legacy
stylesheet only once no `pf-*` dependency remains, and retain all domain data,
application navigation, backend/native bridges and product layouts. This task
does not modify either consumer.
