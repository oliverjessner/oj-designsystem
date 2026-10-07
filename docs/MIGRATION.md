# Consumer migration guide

This task creates the library and examples. No existing consumer is migrated. Follow the source audits linked from [INVENTORY](INVENTORY.md) for evidence and inspect each app's own layout before changing it.

## Common sequence

1. Install a pinned `oj-designsystem` version; import `styles.css` once and put `oj-app` / `oj-site` on the appropriate root. Remove external font/icon requests when no remaining consumer code needs them.
2. Set only `--oj-accent` at the theme root. Replace global aliases with `--oj-*` tokens; keep status colors semantic.
3. Migrate leaf controls/panels and validate labels, errors, focus, touch and contrast. Remove obsolete local button/input declarations after replacing their markup.
4. Migrate tabs, menus and dialogs to the documented declarative contract. Call `initOJ(container)` after dynamic rendering; retain and invoke cleanup before disposal. Keep app handlers for business actions.
5. Migrate shared layouts/prose incrementally. Review screenshots at desktop/mobile and keyboard flows before deleting the old stylesheet.

## BulkPixel

Replace `.button` variants with `oj-button` variants, native input/select/range styles with `oj-input`/`oj-select`/`oj-range`, `.panel` with `oj-panel`, `.section-header` with `oj-section-header`, `.value-badge`/result chips with badges, output paths with `oj-path`, statistics label/value with metrics. Use native radios for exclusive format/resize choices; keep app-mode navigation semantically appropriate rather than turning all choices into tabs. Replace preset action menu presentation and key handlers with the dropdown contract, and dialogs with native `oj-dialog` helpers. Set green `#22c55e`. Keep image previews, inspector, workspace grids, Tauri APIs, presets/watchers/conversion and native file picking local.

## PineFetch

Replace `pf-btn`/`pf-icon-btn`, fields/controls/toggles, panels, stacks/rows/toolbars, status/badges, `pf-stat`, list-card surfaces and detail definitions. Migrate history-detail tabs to `data-oj-tabs`, retaining media/transcript fetching in PineFetch. Existing native dialogs need new presentation and helper wiring, not a custom trap. Queue/context actions can use dropdown behavior while preserving queue operations. Keep download progress state, source branding, logs and all native integration. Remove `pinefetch-designsystem` only after no `pf-*` dependencies remain.

## NO-BULLSHIT-RSS

Replace the pinned PineFetch stylesheet and its unprefixed token aliases gradually: labeled search/filters, settings controls, cards/tags/status, side navigation and empty/loading feedback. Give search a real label. Replace the custom div-based modal with native dialog; replace menu Escape/outside handlers with shared keyboard behavior. Adopt safe stacked toast but retain domain undo callbacks through consumer-owned actions. Keep feeds, topic scoring, classifier semantics, digests, source logos, article webview and feed virtualization local.

## Billly

The requested public URL is unavailable; audit uses complete local `/Users/oli/github/Billly` source whose remote is `oliverjessner/Billy`. Replace `.kpi` / `.panel-metric` with metric composition, table scroll/sort/selection presentation with `oj-table` (app still sorts), labeled fields and switch with native controls, `.tag-chip` with tags, panels/toolbars and tabs with documented semantics. Remove magenta/orange gradients/glow in migrated shared surfaces. Keep charts, invoice/customer details, API/settings persistence, attachments and all billing logic. Add real links/buttons within rows for keyboard actions.

## oliverjessner.at

Replace global font/color/button/form/code foundations with the local package; choose purple `#7d34c5` for the new identity (current site red is historical source evidence). Wrap editorial content in `oj-prose` rather than styling all global elements. Adopt site-header/footer primitives, article/project cards, metadata/tags, callout, breadcrumb and pagination where useful. Preserve current template structure, logos, navigation, search indexing, SEO and content. The current source is Eleventy with older Jekyll templates; the static asset-copy approach works with both. See [Jekyll integration](JEKYLL.md). Remove Bootstrap/vendor foundations only after auditing remaining uses.
