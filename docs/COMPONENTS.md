# Component contracts

`oj-designsystem` is CSS-first. Import `oj-designsystem/styles.css`, then use native HTML with the classes below. Import `initOJ` for declarative tabs, dropdowns, tooltips, dialog triggers, count-up animations and optional video previews. Fonts and Font Awesome are local package assets.

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
| Bullet list           | `<ul class="oj-bullet-list"><li>Keep originals</li><li>Review exports</li></ul>`                                                                                                                         | Visible bullets, wrapping text and nested lists                                                        | Native `ul`/`li` semantics. No JS required; use `oj-link` for destinations within items.                                                                     |
| Interactive list      | `<ul class="oj-list oj-list-interactive"><li><button class="oj-list-item" type="button">Article images</button></li></ul>`                                                                               | Hover/focus/disabled                                                                                   | Use actual controls for actions. For `aria-disabled` links, the consumer suppresses activation.                                                              |
| Key/value list        | `<dl class="oj-key-value"><div><dt>Format</dt><dd class="oj-mono">WebP</dd></div></dl>`                                                                                                                  | Responsive term/value alignment                                                                        | Native definition list expresses relationships.                                                                                                              |
| Definition list       | `<dl class="oj-definition-list"><dt>Accent</dt><dd>A product color.</dd></dl>`                                                                                                                           | Responsive term/value columns                                                                          | Use terms and their definitions.                                                                                                                             |
| Badge                 | `<span class="oj-badge oj-badge-success">Active</span>`                                                                                                                                                  | Neutral/accent/success/warning/danger/info                                                             | A text label explains its meaning; not a button.                                                                                                             |
| Tag                   | `<a class="oj-tag" href="/category/research/">Research</a>`                                                                                                                                              | Anchor or static span; hover/focus on actions                                                          | Use tags for taxonomy. Selection behavior belongs to the consumer and needs explicit semantics.                                                              |
| Status                | `<span class="oj-status oj-status-success"><span class="oj-status-dot" aria-hidden="true"></span>Running</span>`                                                                                         | Success/warning/danger/info; neutral default                                                           | Status is always conveyed by text. Use a live region only if dynamically announcing a change.                                                                |
| Metric                | `<div class="oj-metric"><span class="oj-metric-label">Storage saved</span><strong class="oj-metric-value oj-mono">2.4 GB</strong><span class="oj-metric-hint">This month</span></div>`                   | Compose `.oj-panel.oj-metric-card` around the metric                                                   | Keep label, value and unit explicit. Consumer owns calculations/trends.                                                                                      |
| Path display          | `<span class="oj-path">/Users/example/exports</span>`                                                                                                                                                    | Technical mono string                                                                                  | Full path remains available; do not turn it into an unlabeled icon.                                                                                          |

### Bullet list

Use `oj-bullet-list` on a native unordered list for text with visible points. Items use plain `<li>` elements. Wrapped lines align with the item text; long values wrap within the available width. Spacing, typography and marker colors use shared tokens, and logical indentation follows the text direction.

```html
<ul class="oj-bullet-list">
  <li>Keep originals</li>
  <li>
    Prepare the export
    <ul class="oj-bullet-list">
      <li>Inspect image dimensions</li>
      <li>Choose an output folder</li>
    </ul>
  </li>
  <li>Read the <a class="oj-link" href="/guide/">export guide</a>.</li>
</ul>
```

Apply `oj-bullet-list` to each nested `<ul>` for an indented circle marker. Keep nested lists inside their parent `<li>`. The list needs no initializer, custom events or item classes. Links and controls retain their native keyboard behavior. Insert untrusted item text with `textContent`.

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
  initCountUps,
  initVideoPreviews,
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

### Section Intro

`oj-section-intro` groups optional `oj-kicker` copy, a native heading with `oj-section-title`, and optional `oj-lead` copy. It sets a readable measure and space before the section content. Use `oj-section-intro-center` for centered alignment. The heading class controls appearance; choose its HTML level from the page outline.

```html
<section class="oj-section" aria-labelledby="research-title">
  <header class="oj-section-intro">
    <p class="oj-kicker">Research</p>
    <h2 class="oj-section-title" id="research-title">
      Clear questions. Useful findings.
    </h2>
    <p class="oj-lead">
      Open sources, structured analysis and careful validation.
    </p>
  </header>
  <!-- section content -->
</section>
```

`--oj-intro-width` overrides the default `--oj-prose-width` measure; `--oj-section-title-size` overrides the responsive heading size. No JavaScript is needed. Storybook: **Website / Section Intro**, left-aligned, centered and minimal.

### Hero / Display Headline

`oj-hero` provides website spacing and a container for a copy/media layout. `oj-hero-grid` has two columns when the section itself is at least `44rem` wide; smaller embedded sections stack even on a wide viewport. `oj-hero-copy` groups the heading, lead and actions; `oj-hero-media` contains native media. Use existing `oj-button` classes for real navigation links or actions.

```html
<section class="oj-hero" aria-labelledby="hero-title">
  <div class="oj-container">
    <div class="oj-hero-grid">
      <div class="oj-hero-copy">
        <p class="oj-kicker">Independent research</p>
        <h1 class="oj-display" id="hero-title">
          Understand technology.
          <span class="oj-display-accent">Build useful things.</span>
        </h1>
        <p class="oj-lead">
          Turn open sources into a clear view of digital platforms.
        </p>
        <div class="oj-hero-actions">
          <a class="oj-button oj-button-primary" href="/contact/"
            >Discuss a project</a
          >
        </div>
      </div>
      <figure class="oj-hero-media">
        <img
          src="/assets/research.webp"
          alt="Research workspace"
          width="720"
          height="540"
          fetchpriority="high"
          decoding="async"
        />
      </figure>
    </div>
  </div>
</section>
```

`oj-display` also works on a standalone native heading. It uses Comfortaa, balanced wrapping and the local tokens. `oj-display-accent` emphasizes a span with readable accent text. Override `--oj-display-size` and `--oj-display-width` for specific compositions. Add `oj-hero-center` for a centered single-column hero. For a left-aligned text-only hero, use `oj-hero-copy` directly without a grid. Supply meaningful image alt text, intrinsic dimensions and consumer-owned local media. No text rotation or JavaScript is required. Storybook: **Website / Hero**, media, centered and standalone display.

### Split / CTA Section

`oj-split-section` and `oj-split-section-grid` compose copy with media at the same `44rem` section-width breakpoint as Hero. Reuse Section Intro, `oj-bullet-list` and buttons inside `oj-split-section-copy`. `oj-split-section-actions` wraps action controls. `oj-split-section-media` accepts a native image, video or figure content.

```html
<section
  class="oj-split-section oj-split-section-callout"
  aria-labelledby="contact-title"
>
  <div class="oj-split-section-grid">
    <div class="oj-split-section-copy">
      <header class="oj-section-intro">
        <h2 class="oj-section-title" id="contact-title">
          Make complex systems readable.
        </h2>
        <p class="oj-lead">
          A clear question is the start of a useful collaboration.
        </p>
      </header>
      <div class="oj-split-section-actions">
        <a class="oj-button oj-button-primary" href="/contact/"
          >Start a conversation</a
        >
      </div>
    </div>
    <figure class="oj-split-section-media">
      <img
        src="/assets/workspace.webp"
        alt="Research workspace"
        width="720"
        height="540"
        loading="lazy"
        decoding="async"
      />
    </figure>
  </div>
</section>
```

`oj-split-section-callout` adds an elevated surface, border and inset spacing for a CTA. `oj-split-section-reverse` places the media visually first on wide sections and keeps the authored copy-first order when stacked. CSS placement does not change keyboard/reading order; use noninteractive media in the reversed composition, or author a DOM order suitable for any interactive media. No JavaScript is needed. Storybook: **Website / Split Section**, default, reversed and CTA.

### Video Card

Compose `oj-card oj-video-card` with native `video.oj-video-card-media`, then the existing `oj-card-body`, `oj-card-meta`, `oj-card-title` and `oj-card-actions`. The default media area is `16 / 9`; `oj-video-card-portrait` uses `9 / 16`, and `oj-video-card-square` uses `1 / 1`. `--oj-video-ratio` accepts another CSS aspect ratio. Media uses `object-fit: contain` so controls/captions stay visible.

```html
<article class="oj-card oj-video-card" aria-labelledby="video-title">
  <video
    class="oj-video-card-media"
    controls
    playsinline
    preload="metadata"
    poster="/assets/video-poster.webp"
    aria-label="Introduction to the research method"
  >
    <source src="/assets/introduction.mp4" type="video/mp4" />
    <track
      kind="captions"
      src="/assets/introduction.en.vtt"
      srclang="en"
      label="English"
    />
    <a href="/assets/introduction.mp4">Download video</a>
  </video>
  <div class="oj-card-body">
    <p class="oj-card-meta">Introduction · 2 minutes</p>
    <h3 class="oj-card-title" id="video-title">From source to finding</h3>
    <p class="oj-text">An overview of the method.</p>
  </div>
</article>
```

Native playback needs no library JavaScript. Keep controls available and supply captions for speech/audio content plus appropriate descriptions/transcripts. Avoid placing a video with controls inside a link. Source files, posters, tracks and content remain consumer-owned; the library downloads no external video SDKs.

For the optional preview, add `data-oj-video-preview` to the card and a real `<button type="button" class="oj-button oj-button-secondary" data-oj-video-toggle hidden>Play preview</button>` inside its actions. `initVideoPreviews` (included in `initOJ`) reveals the pause/play button, manages muted viewport playback and respects reduced motion. Omit native `autoplay`; the initializer owns automatic playback. Full behavior and localization: [Video previews](JS-API.md#video-previews). Storybook: **Website / Video Card**, native formats and viewport preview, with original local media and captions.

### Steps / Method

Use a native ordered list, `ol.oj-steps`, with `li.oj-step` children. `role="list"` keeps list semantics in browsers that hide them when markers are removed. `oj-step-number` contains a visible, authored sequence label such as `01`; hide this decorative duplicate with `aria-hidden="true"`. Step headings use the level below the section heading.

```html
<section class="oj-section" aria-labelledby="method-title">
  <header class="oj-section-intro">
    <h2 class="oj-section-title" id="method-title">A clear sequence.</h2>
  </header>
  <ol class="oj-steps" role="list">
    <li class="oj-step">
      <span class="oj-step-number" aria-hidden="true">01</span>
      <h3 class="oj-step-title">Collect</h3>
      <p class="oj-step-description">
        Gather relevant sources and record their origin.
      </p>
    </li>
    <li class="oj-step">
      <span class="oj-step-number" aria-hidden="true">02</span>
      <h3 class="oj-step-title">Validate</h3>
      <p class="oj-step-description">
        Check findings against independent evidence.
      </p>
    </li>
  </ol>
</section>
```

The grid adapts to available width. `--oj-step-min` overrides its default `14rem` minimum item width. `oj-steps-vertical` stacks the steps with a logical inline rule. This is a content sequence, not an interactive form stepper; navigation, current-step state and workflow logic belong to the consumer. No JavaScript is needed. Storybook: **Website / Steps**, Method and Vertical.

### Big Numbers website section

Use a named `section` and a native `dl` for a row of prominent statistics. Each `oj-big-number` groups its `dt.oj-big-number-label` with its `dd.oj-big-number-value`. The number appears above the label; the semantic term/value order is preserved. The grid adapts to available width, and the number size follows the width of its own item. Add `oj-container` around the list when it should align with the website's content width.

```html
<section class="oj-big-number-section" aria-label="Recherche in Zahlen">
  <div class="oj-container">
    <dl class="oj-big-number-list">
      <div class="oj-big-number">
        <dt class="oj-big-number-label">Stunden Videomaterial analysiert</dt>
        <dd class="oj-big-number-value">
          <span
            data-oj-count-up="1000"
            data-oj-count-locale="de-DE"
            data-oj-count-suffix="h"
            >1.000h</span
          >
          <span class="oj-big-number-suffix">+</span>
        </dd>
      </div>
      <div class="oj-big-number">
        <dt class="oj-big-number-label">Texte/Transkripte analysiert</dt>
        <dd class="oj-big-number-value">
          <span
            data-oj-count-up="30000"
            data-oj-count-locale="de-DE"
            data-oj-count-delay="90"
            >30.000</span
          >
          <span class="oj-big-number-suffix">+</span>
        </dd>
      </div>
      <div class="oj-big-number">
        <dt class="oj-big-number-label">Websites ausgewertet</dt>
        <dd class="oj-big-number-value">
          <span
            data-oj-count-up="10000"
            data-oj-count-locale="de-DE"
            data-oj-count-delay="180"
            >10.000</span
          >
          <span class="oj-big-number-suffix">+</span>
        </dd>
      </div>
    </dl>
  </div>
</section>
```

```js
import { initCountUps } from 'oj-designsystem';
const cleanup = initCountUps(document.querySelector('.oj-big-number-section'));
// Or call initOJ() once for all declarative components after mounting.
// cleanup() before replacing/removing the owned section.
```

`oj-big-number-suffix` displays a small accent-colored suffix such as `+`. Keep it as real text so its meaning remains accessible. Static values need no attributes or initializer. `--oj-big-number-min` controls the minimum grid item width (default `13rem`); `--oj-big-number-size` overrides the responsive number size. Use shared typography/spacing/color tokens for other theme changes.

Count-up attributes, fallback behavior and lifecycle are documented in [JS-API](JS-API.md#count-up-animation). The examples above are illustrative values; the consumer supplies the labels and verified totals.

## Composition, testing and boundaries

Storybook includes all required foundations, controls, website components, seven patterns and two complete examples. It also includes navigation and list compositions. `examples/vanilla` and `examples/website` consume package exports via a `file:../..` dependency; they never reach into `src`.

Automated behavior checks cover public initialization, tabs, menus, tooltips, dialogs, notifications and custom events. Automated accessibility checks complement manual review of keyboard focus, readable Comfortaa labels at 12/13/14/16px, article text, multiple accents and narrow viewports. Aim for WCAG 2.2 AA in each consumer; application content and composition still need their own verification.

The library does not sort data, route pages, process images, fetch feeds, calculate invoices, send messages, index article search, inject analytics or enforce an application shell. These responsibilities remain in the consumer.

Storybook setup follows its official [decorator lifecycle](https://storybook.js.org/docs/writing-stories/decorators), [toolbar and global configuration](https://storybook.js.org/docs/essentials/toolbars-and-globals), and [accessibility addon documentation](https://storybook.js.org/docs/writing-tests/accessibility-testing). The public library does not depend on Storybook.
