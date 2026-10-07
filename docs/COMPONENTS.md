# Component contracts

`oj-designsystem` is CSS-first. Import `oj-designsystem/styles.css`, then use native HTML with the classes below. Import `initOJ` only for declarative tabs, dropdowns, tooltips and dialog triggers. Fonts and Font Awesome are local package assets.

Every component is shown in Storybook. Change the Accent toolbar and viewport to inspect the same markup under green, purple, blue, orange and red at desktop, laptop, tablet and mobile widths. Native `:disabled`, `:focus-visible`, `:checked`, `readonly` and `aria-invalid` are preferred to custom state classes.

## Foundations and layout

| Component and purpose | HTML example                                                                                       | Variants / states                                                             | Accessibility and behavior                                                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Root scope            | `<main class="oj-root">…</main>`                                                                   | `.oj-app`, `.oj-site`, `[data-oj-theme="dark"]`                               | Scope base typography and surfaces. The package does not impose application architecture.                                                    |
| Headings              | `<h2 class="oj-heading-2">Export settings</h2>`                                                    | `.oj-heading`, `.oj-heading-1` through `.oj-heading-4`                        | Pick the correct heading level for document structure; class controls visual size.                                                           |
| Body text             | `<p class="oj-text">Review your files.</p>`                                                        | `.oj-small`, `.oj-muted`, `.oj-soft`, `.oj-mono`, `.oj-kicker`, `.oj-caption` | Supplementary styling does not replace readable text or structural headings. Mono is for technical values.                                   |
| Link                  | `<a class="oj-link" href="/projects/">Projects</a>`                                                | Hover and visible focus                                                       | Use anchors for destinations and buttons for actions. Keep meaningful link text.                                                             |
| Divider               | `<hr class="oj-divider" />`                                                                        | Horizontal                                                                    | Native separator; use it when the change of subject is meaningful.                                                                           |
| Focus                 | `<button class="oj-button">Open</button>`                                                          | Native `:focus-visible`                                                       | A shared visible ring appears on controls. Do not remove it in consumer CSS.                                                                 |
| Screen reader text    | `<span class="oj-sr-only">Export status</span>`                                                    | `.oj-hidden` / native `hidden` for fully hidden content                       | Screen-reader-only text remains in the accessibility tree. `hidden` removes inactive content from interaction.                               |
| Skip link             | `<a class="oj-skip-link" href="#main">Skip to content</a>`                                         | Visible on focus                                                              | Target an actual main region or focusable anchor destination.                                                                                |
| Stack                 | `<div class="oj-stack">…</div>`                                                                    | Vertical flow                                                                 | Layout only; use semantic child elements.                                                                                                    |
| Inline / cluster      | `<div class="oj-cluster">…</div>`                                                                  | `.oj-inline` for aligned content; `.oj-cluster` for wrapping                  | Wrap controls rather than clipping them at narrow widths.                                                                                    |
| Grid / split          | `<div class="oj-grid">…</div>`                                                                     | `.oj-split`                                                                   | Small generic layout helpers. Domain-specific columns remain consumer CSS.                                                                   |
| Toolbar               | `<div class="oj-toolbar">…</div>`                                                                  | Wraps controls                                                                | Add `role="toolbar"` only when the consumer also implements the full toolbar keyboard pattern. A generic container does not claim that role. |
| Section / header      | `<section class="oj-section"><header class="oj-section-header"><h2>Files</h2></header>…</section>` | Generic composition                                                           | Name regions with headings where useful; do not create nested panels without a purpose.                                                      |
| Container             | `<main class="oj-container">…</main>`                                                              | Responsive content width                                                      | Consumer controls page composition and landmarks.                                                                                            |

`oj-scroll-area` opts into scrolling with subtle scrollbars and a stable gutter: `<div class="oj-scroll-area" tabindex="0" role="region" aria-label="Export log">…</div>`. The consumer sets any height constraint. Name and make a scroll-only region keyboard focusable when needed; keep its content readable and focus outlines visible. Scrollbars are not restyled globally.

## Buttons and forms

### Button

```html
<button type="button" class="oj-button oj-button-primary">
  <i class="fa-solid fa-download" aria-hidden="true"></i>
  Export
</button>
```

Purpose: a clear action. Variants: `oj-button-primary`, `oj-button-secondary`, `oj-button-ghost`, `oj-button-danger`, `oj-button-compact`. State: native `disabled`; `aria-busy="true"` (or the optional `oj-button-loading` presentation modifier) and an optional `.oj-spinner` for loading. Keep a text label while busy. The consumer disables the button when repeated activation should be prevented. Use `type="button"` for non-submit actions within forms. An anchor can use the button classes when it navigates.

### Icon button

```html
<button class="oj-icon-button" type="button" aria-label="Settings">
  <i class="fa-solid fa-gear" aria-hidden="true"></i>
</button>
```

Purpose: a compact named action. States: hover, active, focus, disabled and `aria-busy`. A tooltip is optional supplementary help; `aria-label` supplies the name even if the tooltip never appears. No JavaScript is needed for the button itself.

### Field, label, helper and validation

```html
<div class="oj-field">
  <label class="oj-label" for="project-name">Project name</label>
  <input
    id="project-name"
    class="oj-input"
    type="text"
    aria-invalid="true"
    aria-describedby="project-error"
    required
  />
  <p id="project-error" class="oj-helper oj-helper-error">
    Project name is required.
  </p>
</div>
```

Purpose: visible label and contextual feedback. Helpers support `oj-helper-error`, `oj-helper-warning`, `oj-helper-success`. Link feedback with `aria-describedby`; `aria-invalid` communicates an error independently of its color. Native constraints and submission logic belong to the consumer. Placeholder text supplements a label, never replaces it.

Inputs, selects and textareas optionally use `data-oj-kind="warning"` or `data-oj-kind="success"` for semantic borders. Use `aria-invalid="true"` for errors. Inline messages support `data-oj-kind="success|warning|danger|error"` (choose one value), for example `<p class="oj-inline-message" data-oj-kind="warning">Review the output folder.</p>`. Always include explanatory text; visual state does not announce or validate a value by itself.

| Control and purpose | HTML example                                                                                                                                                                      | Variants / states                                                  | Accessibility / JS                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Text input          | `<input class="oj-input" id="name" type="text" />`                                                                                                                                | Text/search/password/number/url/email; disabled, readonly, invalid | Associate a visible label. Use correct `type`, `autocomplete`, limits and input mode. No JS required.    |
| Search input        | `<input class="oj-input" id="search" type="search" />`                                                                                                                            | Native clear/search behavior                                       | Consumer owns filtering and announces results when appropriate.                                          |
| Password input      | `<input class="oj-input" id="password" type="password" autocomplete="current-password" />`                                                                                        | Native obscured text                                               | Consumer owns authentication and any reveal action.                                                      |
| Number input        | `<input class="oj-input" id="width" type="number" min="1" value="1600" />`                                                                                                        | Native min/max/step                                                | State units in visible label/help.                                                                       |
| URL input           | `<input class="oj-input" id="url" type="url" autocomplete="url" />`                                                                                                               | Native URL validation                                              | Label the destination or purpose.                                                                        |
| Email input         | `<input class="oj-input" id="email" type="email" autocomplete="email" />`                                                                                                         | Native email validation                                            | Label the email field; do not assume validation proves delivery.                                         |
| Textarea            | `<textarea class="oj-textarea" id="notes" rows="4"></textarea>`                                                                                                                   | Disabled, readonly, invalid                                        | Visible label and linked help; native resizing remains available.                                        |
| Select              | `<select class="oj-select" id="format"><option>WebP</option><option>PNG</option></select>`                                                                                        | Native selected and disabled states                                | Native select supplies keyboard interaction. Consumer owns options/data.                                 |
| Input group         | `<div class="oj-input-group"><input class="oj-input" id="width" type="number" /><span class="oj-unit">px</span></div>`                                                            | Input + unit, button, or clear action                              | Keep an associated label and name every action; unit text is visible.                                    |
| Checkbox            | `<label class="oj-check"><input class="oj-checkbox" type="checkbox" /> Keep originals</label>`                                                                                    | Checked, indeterminate via native property, disabled               | Native independent choice; Space toggles it.                                                             |
| Radio               | `<label class="oj-check"><input class="oj-radio" type="radio" name="mode" /> Fit within bounds</label>`                                                                           | Checked and disabled                                               | Use a named group and fieldset/legend. Native Arrow keys choose one option.                              |
| Switch              | `<label class="oj-switch"><input type="checkbox" role="switch" /><span class="oj-switch-track" aria-hidden="true"></span><span>Watch folder</span></label>`                       | Checked and disabled                                               | Native checkbox behavior. Visible text names the setting; the decorative track is hidden.                |
| Range slider        | `<input class="oj-range" id="quality" type="range" min="1" max="100" value="80" />`                                                                                               | Value and disabled                                                 | Provide label, units and an optional linked output. Native Arrow keys adjust values.                     |
| Segmented choice    | `<div class="oj-segmented"><label><input type="radio" name="format" checked /><span>WebP</span></label><label><input type="radio" name="format" /><span>PNG</span></label></div>` | Checked and disabled                                               | Wrap in fieldset/legend. This is an exclusive setting, distinct from panel tabs. No library JS required. |

## Containers, navigation and data

| Component and purpose | HTML example                                                                                                                                                                                             | Variants / states                                                                                      | Accessibility / JS                                                                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Panel                 | `<section class="oj-panel"><h2>Export settings</h2>…</section>`                                                                                                                                          | `oj-panel-elevated`, `oj-panel-interactive`, `oj-panel-compact`                                        | An interactive panel must use a real anchor/button or contain one. No JS for styling.                                                                        |
| Top navigation        | `<nav class="oj-nav" aria-label="Main"><a class="oj-nav-link" href="/" aria-current="page">Overview</a></nav>`                                                                                           | Hover/focus/current page                                                                               | Use destinations and `aria-current`. Consumer owns routing.                                                                                                  |
| Sidebar navigation    | `<nav class="oj-sidebar-nav" aria-label="Settings"><a class="oj-nav-link" href="/settings/">General</a></nav>`                                                                                           | Same link states                                                                                       | Name multiple navigation landmarks; application layout remains consumer-owned.                                                                               |
| Breadcrumb            | `<nav class="oj-breadcrumb" aria-label="Breadcrumb"><ol><li><a class="oj-link" href="/">Home</a></li><li><span aria-current="page">Project</span></li></ol></nav>`                                       | Current destination                                                                                    | Native ordered list and links express the path.                                                                                                              |
| Pagination            | `<nav class="oj-pagination" aria-label="Archive pages"><a class="oj-button oj-button-ghost" href="/blog/" aria-current="page">1</a><a class="oj-button oj-button-ghost" href="/blog/page/2">2</a></nav>` | Current/hover/focus                                                                                    | Icon-only previous/next links require names. Consumer generates URLs.                                                                                        |
| Table container       | `<div class="oj-table-container" role="region" aria-label="Files" tabindex="0"><table class="oj-table">…</table></div>`                                                                                  | Horizontal overflow                                                                                    | Name scroll regions and make overflow keyboard reachable. Provide caption and header scope.                                                                  |
| Table                 | `<table class="oj-table"><caption>Files</caption><thead><tr><th scope="col">File</th></tr></thead><tbody><tr><td>header.jpg</td></tr></tbody></table>`                                                   | `oj-table-compact`, `oj-table-hover`, `oj-table-sticky`; row `data-oj-state="selected"`; `.oj-numeric` | Use a real button/link/checkbox for row interaction. Styling a row does not make it a control. Native table rows do not receive unsupported `aria-selected`. |
| Sort header           | `<th scope="col" aria-sort="ascending"><button class="oj-table-sort" type="button">File <i class="fa-solid fa-arrow-up" aria-hidden="true"></i></button></th>`                                           | `aria-sort="ascending"` / `descending` on the current header                                           | Consumer owns sorting and keeps aria-sort in sync.                                                                                                           |
| Simple list           | `<ul class="oj-list"><li class="oj-list-item">Keep originals</li></ul>`                                                                                                                                  | Static content                                                                                         | Preserve list structure.                                                                                                                                     |
| Interactive list      | `<ul class="oj-list oj-list-interactive"><li><button class="oj-list-item" type="button">Article images</button></li></ul>`                                                                               | Hover/focus/disabled                                                                                   | Use actual controls for actions. For `aria-disabled` links, the consumer suppresses activation.                                                              |
| Key/value list        | `<dl class="oj-key-value"><div><dt>Format</dt><dd class="oj-mono">WebP</dd></div></dl>`                                                                                                                  | Responsive term/value alignment                                                                        | Native definition list expresses relationships.                                                                                                              |
| Definition list       | `<dl class="oj-definition-list"><dt>Accent</dt><dd>A product color.</dd></dl>`                                                                                                                           | Responsive term/value columns                                                                          | Use terms and their definitions.                                                                                                                             |
| Badge                 | `<span class="oj-badge oj-badge-success">Active</span>`                                                                                                                                                  | Neutral/accent/success/warning/danger/info                                                             | A text label explains its meaning; not a button.                                                                                                             |
| Tag                   | `<a class="oj-tag" href="/category/research/">Research</a>`                                                                                                                                              | Anchor or static span; hover/focus on actions                                                          | Use tags for taxonomy. Selection behavior belongs to the consumer and needs explicit semantics.                                                              |
| Status                | `<span class="oj-status oj-status-success"><span class="oj-status-dot" aria-hidden="true"></span>Running</span>`                                                                                         | Success/warning/danger/info; neutral default                                                           | Status is always conveyed by text. Use a live region only if dynamically announcing a change.                                                                |
| Metric                | `<div class="oj-metric"><span class="oj-metric-label">Storage saved</span><strong class="oj-metric-value oj-mono">2.4 GB</strong><span class="oj-metric-hint">This month</span></div>`                   | Compose `.oj-panel.oj-metric-card` around the metric                                                   | Keep label, value and unit explicit. Consumer owns calculations/trends.                                                                                      |
| Path display          | `<span class="oj-path">/Users/example/exports</span>`                                                                                                                                                    | Technical mono string                                                                                  | Full path remains available; do not turn it into an unlabeled icon.                                                                                          |

## Feedback and progress

| Component and purpose | HTML example                                                                                                                                                                                                                                                                                                              | Variants / states                                                 | Accessibility / JS                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Alert                 | `<div class="oj-alert oj-alert-warning"><strong>Check output folder</strong><p>Existing names may be replaced.</p></div>`                                                                                                                                                                                                 | Info/success/warning/danger                                       | Static content needs no announcement role. Use `role="status"` for polite new feedback or `role="alert"` for urgent errors.                      |
| Inline message        | `<p class="oj-inline-message">Review the existing files.</p>`                                                                                                                                                                                                                                                             | Optional semantic modifier                                        | Place close to relevant control; associate with aria-describedby when it describes that field.                                                   |
| Empty state           | `<div class="oj-empty-state"><i class="fa-solid fa-folder-open oj-empty-state-icon" aria-hidden="true"></i><h2 class="oj-empty-state-title">No files</h2><p class="oj-empty-state-description">Choose files to start.</p><div class="oj-empty-state-actions"><button class="oj-button">Choose files</button></div></div>` | Optional icon/actions; filtered or first-run content              | Explain why it is empty and how to recover; preserve a compact hierarchy.                                                                        |
| Progress              | `<label class="oj-label" for="export-progress">Export progress</label><progress class="oj-progress" id="export-progress" value="64" max="100">64%</progress>`                                                                                                                                                             | Determinate; omit value for indeterminate                         | Name the operation. Provide useful visible text such as “16 of 25 files”. Native value exposes progress.                                         |
| Spinner               | `<span class="oj-spinner" aria-hidden="true"></span><span role="status">Reading metadata…</span>`                                                                                                                                                                                                                         | Animation respects reduced motion                                 | Decorative spinner accompanies text, never carries the only status information.                                                                  |
| Skeleton              | `<div class="oj-skeleton" aria-hidden="true"></div>`                                                                                                                                                                                                                                                                      | Optional placeholder                                              | Only when useful. Announce loading in a separate status; do not expose meaningless placeholders.                                                 |
| Dropzone              | `<div class="oj-dropzone"><label class="oj-label" for="files">Add images</label><input class="oj-input" id="files" type="file" multiple /></div>`                                                                                                                                                                         | `data-oj-state="drag-active"` / `loading`; `aria-disabled="true"` | Visual contract only. Always include a real input/button fallback and let the consumer handle files, drag events, disabled logic and validation. |

## JavaScript lifecycle

```js
import {
  initOJ,
  initTabs,
  initDropdowns,
  initTooltips,
  initDialogs,
} from 'oj-designsystem';

const cleanup = initOJ(document.querySelector('#workspace'));
// Before replacing/removing this view:
cleanup();
```

Each initializer takes an optional `Document` or element root and returns a cleanup function. `initOJ()` discovers the declarative attributes below. Repeated initialization is safe; a repeated call does not own the previous call's listeners. Keep and call the original cleanup function. Initialize after inserting markup. On dynamic view replacement, clean up the old view and initialize the new one. Importing the ESM entry point does not read the DOM.

Custom events are namespaced, bubble and contain details on `event.detail`: tabs emit `oj:change`; dropdowns emit `oj:open`, `oj:close`, `oj:select`; dialogs emit `oj:open` and `oj:close`. Event payloads are documented by the package TypeScript declarations. App data actions are consumer code.

### Tabs

```html
<div class="oj-tabs" data-oj-tabs>
  <div class="oj-tab-list" role="tablist" aria-label="Project sections">
    <button
      class="oj-tab"
      role="tab"
      aria-selected="true"
      aria-controls="overview"
    >
      Overview
    </button>
    <button
      class="oj-tab"
      role="tab"
      aria-selected="false"
      aria-controls="items"
    >
      Items
    </button>
  </div>
  <section class="oj-tab-panel" role="tabpanel" id="overview">
    Overview content
  </section>
  <section class="oj-tab-panel" role="tabpanel" id="items">
    Items content
  </section>
</div>
```

Purpose: panel navigation. `initTabs(root)` links tabs/panels, maintains selection/visibility and roving tabindex, handles click, Arrow keys, Home and End, and skips disabled tabs. Horizontal is the default; `aria-orientation="vertical"` changes the Arrow axis. Disabled controls use native `disabled`. Source panels remain readable before initialization; the initializer applies `hidden` to inactive panels. Do not confuse tabs with an exclusive data setting.

### Dropdown and menu

```html
<div class="oj-dropdown" data-oj-dropdown>
  <button
    class="oj-button oj-button-secondary"
    data-oj-dropdown-trigger
    type="button"
  >
    Actions
  </button>
  <div class="oj-menu" data-oj-dropdown-menu role="menu" hidden>
    <button
      class="oj-menu-item"
      role="menuitem"
      type="button"
      data-oj-value="export"
    >
      Export
    </button>
    <button class="oj-menu-item" role="menuitem" type="button" disabled>
      Archive
    </button>
  </div>
</div>
```

Purpose: a small action menu. `initDropdowns(root)` manages the trigger's expanded state, keyboard opening, Arrow keys, Home/End, typeahead, Escape, outside click and return focus. Disabled actions are skipped. `oj:select` includes `{ item, value }`; the consumer reacts to the action. `.oj-menu-divider` can style an `hr`; `.oj-menu-item-danger` identifies a destructive action. Use ordinary link navigation for site navigation rather than claiming a menu role without menu behavior. Context-menu triggering and menu data logic are outside the current API.

### Tooltip

```html
<button
  class="oj-icon-button"
  type="button"
  aria-label="Settings"
  data-oj-tooltip="Settings"
>
  <i class="fa-solid fa-gear" aria-hidden="true"></i>
</button>
```

Purpose: optional short help. `initTooltips(root)` creates `.oj-tooltip` text, links it with `aria-describedby`, displays it for hover/focus and dismisses it with Escape. The generated element uses text content rather than HTML. Avoid essential instructions, interactive content and tooltip-only accessible names. Cleanup removes generated content and restores the original description relationship.

### Native dialog

```html
<button class="oj-button" data-oj-dialog-open="edit-project" type="button">
  Edit
</button>
<dialog
  class="oj-dialog"
  data-oj-dialog
  id="edit-project"
  aria-labelledby="edit-title"
>
  <header class="oj-dialog-header">
    <h2 class="oj-dialog-title" id="edit-title">Edit project</h2>
  </header>
  <div class="oj-dialog-body">
    <label class="oj-label" for="edit-name">Name</label>
    <input class="oj-input" id="edit-name" autofocus />
  </div>
  <footer class="oj-dialog-footer">
    <button
      class="oj-button oj-button-ghost"
      data-oj-dialog-close="cancel"
      type="button"
    >
      Cancel
    </button>
    <button
      class="oj-button oj-button-primary"
      data-oj-dialog-close="save"
      type="button"
    >
      Save
    </button>
  </footer>
</dialog>
```

Purpose: a focused modal task. Native `dialog.showModal()` supplies focus containment and Escape behavior in current supported browsers. Helpers focus a meaningful control and restore the opener. Name the dialog with `aria-labelledby`; optionally describe it with `aria-describedby`. Header/body/footer classes style composition. A native `form method="dialog"` is supported.

```js
import { openDialog, closeDialog, confirmDialog } from 'oj-designsystem';

openDialog('edit-project', { root: document, trigger: opener });
closeDialog('edit-project', 'cancel');
const confirmed = await confirmDialog({
  title: 'Remove file?',
  message: 'Remove this file from the preview queue?',
  confirmLabel: 'Remove',
  cancelLabel: 'Cancel',
  variant: 'danger',
  root: document,
});
```

`confirmDialog` returns a boolean promise. It presents user text safely, uses a native dialog, supports cancel/Escape and cleans up the temporary dialog. The consumer performs the actual action only after the promise resolves true.

### Toast

```js
import { toast } from 'oj-designsystem';

const notification = toast('Export completed', {
  type: 'success', // info | success | warning | danger | error
  duration: 4000, // 0 means persistent
  root: document,
});
notification.dismiss();
```

Purpose: short operation feedback. Toasts stack in `.oj-toast-region`, announce content with an accessible live region, provide a named dismiss button and expire after their duration. Timers pause on hover/focus. `error` aliases `danger`. The return value is `{ element, dismiss }`. `dismissLabel` can supply localized dismiss text. Use persistent visible inline feedback for essential information; a toast is supplemental. Reduced motion suppresses decorative transitions.

## Editorial and website components

All prose styles are opt-in. Do not add a global article reset in the consumer.

| Component and purpose     | HTML example                                                                                                                                                                                                         | Variants / states                                                      | Accessibility / JS                                                                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prose                     | `<article class="oj-prose"><h1>Article title</h1><p>Content…</p></article>`                                                                                                                                          | h1–h4, p, ul/ol, links, blockquote, code/pre, table, figure/figcaption | Readable line length and relaxed leading; native article semantics. No JS.                                                                                              |
| Code block                | `<pre class="oj-code-block"><code>npm install oj-designsystem</code></pre>`                                                                                                                                          | Scrollable block; inline `<code>` in prose                             | Technical font; preserve plain-text selection. Use `.oj-inline-code` on standalone inline code outside prose. Tokenizer and copy actions are consumer responsibilities. |
| Blockquote                | `<figure><blockquote><p>Example quotation.</p></blockquote><figcaption>Source</figcaption></figure>` inside `.oj-prose`                                                                                              | Quiet editorial rule                                                   | Native quotation and caption relationship; no decorative giant quote icon.                                                                                              |
| Card                      | `<article class="oj-card"><div class="oj-card-body"><h2 class="oj-card-title">Project</h2><p>Summary</p></div></article>`                                                                                            | `.oj-card-media`, `.oj-card-meta`, `.oj-card-actions`                  | Title uses the correct heading level. Avoid wrapping nested buttons/links in another link.                                                                              |
| Article card              | `<article class="oj-card oj-article-card"><div class="oj-card-body"><h2 class="oj-card-title"><a class="oj-link" href="/article/">Article title</a></h2><p>Excerpt</p></div></article>`                              | Optional media, date, tags, metadata                                   | Image needs an appropriate alt description; the title is a clear destination.                                                                                           |
| Project card              | `<article class="oj-card oj-project-card"><div class="oj-card-body"><h2 class="oj-card-title">Tool</h2><p>Utility description</p><a class="oj-button oj-button-secondary" href="/tool/">Explore</a></div></article>` | Shared card primitives                                                 | Branding, download links and product facts belong to the website.                                                                                                       |
| Article metadata / byline | `<p class="oj-byline">By Example Author · <time datetime="2026-10-07">7 October 2026</time> · 5 min read</p>`                                                                                                        | `.oj-card-meta` for wrapping metadata                                  | Use semantic `time`; consumer owns reading-time calculations and content schemas.                                                                                       |
| Callout                   | `<aside class="oj-callout oj-callout-note"><strong>Note</strong><p>Implementation context.</p></aside>`                                                                                                              | Info/note/warning                                                      | Static supporting text needs no live-region role.                                                                                                                       |
| Site header               | `<header class="oj-site-header"><div class="oj-container"><a class="oj-link" href="/">Journal</a><nav class="oj-nav" aria-label="Main">…</nav></div></header>`                                                       | Responsive wrapping                                                    | Consumer supplies links, branding and any advanced mobile disclosure logic.                                                                                             |
| Site footer               | `<footer class="oj-site-footer"><nav class="oj-cluster" aria-label="Footer">…</nav><small>© Example</small></footer>`                                                                                                | Generic footer grouping                                                | Name navigation groups; legal text stays consumer-owned.                                                                                                                |
| Accordion                 | `<details class="oj-accordion"><summary>Supported formats</summary><div class="oj-accordion-body"><p>JPEG, PNG, WebP and AVIF.</p></div></details>`                                                                  | Native open/closed                                                     | Use native details when disclosure is needed. No custom JavaScript required.                                                                                            |

## Composition, testing and boundaries

Storybook includes all required foundations, controls, website components, seven patterns and two complete examples. It also includes navigation and list compositions. `examples/vanilla` and `examples/website` consume package exports via a `file:../..` dependency; they never reach into `src`.

Automated behavior checks cover public initialization, tabs, menus, tooltips, dialogs, notifications and custom events. Automated accessibility checks complement manual review of keyboard focus, readable Comfortaa labels at 12/13/14/16px, article text, multiple accents and narrow viewports. Aim for WCAG 2.2 AA in each consumer; application content and composition still need their own verification.

The library does not sort data, route pages, process images, fetch feeds, calculate invoices, send messages, index article search, inject analytics or enforce an application shell. These responsibilities remain in the consumer.

Storybook setup follows its official [decorator lifecycle](https://storybook.js.org/docs/writing-stories/decorators), [toolbar and global configuration](https://storybook.js.org/docs/essentials/toolbars-and-globals), and [accessibility addon documentation](https://storybook.js.org/docs/writing-tests/accessibility-testing). The public library does not depend on Storybook.
