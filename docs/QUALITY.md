# 0.1.0 quality record

Verification date: 7 October 2026. Local environment: macOS, Node 26.10.0, locked npm dependencies. CI repeats the same gates on Linux with Node 24. The public library is plain HTML/CSS/ESM; Storybook's larger development bundles are not shipped in the npm package.

## Completed gates

| Gate                      | Result                                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Dependency installation   | Successful; committed package lock                                                                                          |
| `npm run lint`            | ESLint and CSS namespace/no-ID/no-important guards pass                                                                     |
| `npm run format:check`    | All authored files pass                                                                                                     |
| `npm test`                | 44 public API/behavior tests pass                                                                                           |
| `npm run build`           | Minified ESM/CSS, local fonts, icons, types and original licenses generated                                                 |
| `npm run build-storybook` | 75 stories across 59 groups build successfully                                                                              |
| `npm run test:browser`    | 76 checks pass; two intentional inventory duplicates skipped                                                                |
| Storybook inventory audit | Every story renders; final play/hook status succeeds; no console/page errors or WCAG-tagged axe violations                  |
| `npm run verify:package`  | Tarball contents, export targets, notices, every font/icon CSS URL and absence of runtime CDNs verified                     |
| `npm run verify:consumer` | Actual tarball installed outside the repository; both vanilla and website production builds and public ESM/CSS imports pass |
| Build reproducibility     | Two consecutive distribution builds have identical file paths and SHA-256 contents                                          |

The browser suite runs 25 component/runtime checks in each of Playwright's Chromium 153.0.8010.12, Firefox 155.0 and WebKit 26.6 engines. The full Storybook inventory runs once in Chromium; its duplicates are explicitly skipped in the other two engines. This covers native modal focus/inertness/Escape/restoration, confirmation results, roving tabs, disabled choices, menu keyboard flow and viewport positioning, scoped Shadow DOM, hoverable modal tooltips, safe literal text, toast announcements/dismissal, initialization ownership and custom events.

## Visual and accessibility evidence

- Five product accents: green, purple, blue, orange and red. Axe checks use WCAG A/AA, 2.1 and 2.2 tags. Primary text also meets at least 4.5:1 contrast in default, hover and active states for each preset in all three engines.
- Responsive fixtures at 375, 768, 1024 and 1440px have no outer-page overflow. Coarse-pointer button, icon-button and input targets are at least 44px. Reduced-motion checks disable functional animation. Without JS, all tab content remains readable.
- Local font/icon requests succeed without external runtime resources. Comfortaa, JetBrains Mono and Font Awesome load from distribution URLs.
- DesktopTool, purple EditorialWebsite and Typography/Readability screenshots were inspected at 1440 and 390px. Comfortaa at 12/13px labels and 14/16px body sizes remains legible, labels and native input values fit, panels stack, technical data uses mono, and article tables/code stay within their reading context. The examples have no page or console errors.

## Distribution and performance

The complete minified JavaScript distribution is approximately 14KB; the stylesheet is approximately 138KB including approximately 92KB of official Font Awesome CSS. Fonts are unicode-subsetted variable WOFF2 assets with `font-display: swap`; the package also includes solid, regular and brand icon WOFF2 fonts. The compressed tarball is approximately 633KiB including documentation and licenses.

A minified esbuild consumer importing `initOJ` and `toast` produces 12,440 bytes (4,601 bytes gzip). Importing only `toast` produces 2,277 bytes (1,154 bytes gzip), demonstrating elimination of unused component runtime. These are fixture measurements, not a guarantee for every bundler/application.

## Practical limits and release state

These checks validate the provided component contracts and examples, rather than arbitrary consumer content or custom token palettes. Real VoiceOver/NVDA review and checks in the actual installed Safari/Edge and Tauri/Electron webviews remain useful before a consumer release. No blanket WCAG certification is claimed.

Version 0.1.0 is built and packed locally; it has not been published to the npm registry. Existing consumer repositories have not been migrated. Light mode and pointer-positioned context menus are intentionally outside this initial release. Source decisions and migration boundaries are recorded in [INVENTORY](INVENTORY.md) and [MIGRATION](MIGRATION.md).
