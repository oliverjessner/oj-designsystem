# oj-designsystem: agent reference

## Install, styles, JavaScript

```sh
npm install oj-designsystem
```

```js
import 'oj-designsystem/styles.css';
import { initOJ, toast } from 'oj-designsystem';
const cleanup = initOJ(); // or initOJ(container); cleanup before disposing owned UI
```

Use `oj-app`, `oj-site` or `oj-root` on the UI root to opt into base typography/background. Set branding **after** the stylesheet:

```css
:root {
  --oj-accent: #22c55e;
}
/* For a nested product scope use [data-oj-theme="dark"] and set its --oj-accent. */
```

## Component examples

```html
<button class="oj-button oj-button-primary">Save</button>
<div class="oj-field">
  <label class="oj-label" for="name">Name</label>
  <input class="oj-input" id="name" aria-describedby="name-help" />
  <p class="oj-helper" id="name-help">Choose a descriptive name.</p>
</div>
<section class="oj-panel"><h2 class="oj-heading-2">Settings</h2></section>
<span class="oj-badge oj-badge-success">Ready</span>
```

```html
<div class="oj-tabs" data-oj-tabs>
  <div class="oj-tab-list" role="tablist" aria-label="Project">
    <button
      class="oj-tab"
      role="tab"
      aria-selected="true"
      id="overview-tab"
      aria-controls="overview"
    >
      Overview
    </button>
    <button class="oj-tab" role="tab" id="history-tab" aria-controls="history">
      History
    </button>
  </div>
  <div
    class="oj-tab-panel"
    role="tabpanel"
    id="overview"
    aria-labelledby="overview-tab"
  >
    Overview content
  </div>
  <div
    class="oj-tab-panel"
    role="tabpanel"
    id="history"
    aria-labelledby="history-tab"
  >
    History content
  </div>
</div>
<table class="oj-table">
  <caption>
    Projects
  </caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Research</td>
      <td>Ready</td>
    </tr>
  </tbody>
</table>
<button class="oj-button oj-button-secondary" data-oj-dialog-open="settings">
  Settings
</button>
<dialog
  class="oj-dialog"
  data-oj-dialog
  id="settings"
  aria-labelledby="settings-title"
>
  <div class="oj-dialog-body">
    <h2 id="settings-title">Settings</h2>
    <button class="oj-button oj-button-secondary" data-oj-dialog-close>
      Close
    </button>
  </div>
</dialog>
```

```js
toast('Export completed', { type: 'success' }); // plain text, duration: 0 to persist
```

Icon-only actions: `oj-icon-button` needs `aria-label`; Font Awesome icon gets `aria-hidden="true"`. Complete APIs/examples: [COMPONENTS](COMPONENTS.md), [JS-API](JS-API.md), [THEMING](THEMING.md). Check Storybook before inventing a component.

## Rules

1. Use existing `oj-*` components first.
2. Use `oj-button` before writing custom button styles.
3. Use `oj-input` before writing custom input styles.
4. Use tokens; do not hardcode design colors.
5. Set product accent through `--oj-accent` only.
6. Keep semantic status colors separate from accent.
7. Use the official API instead of overriding component selectors.
8. Keep app CSS focused on layout and domain components.
9. Propose reusable components here when multiple consumers need them.
10. Do not add another UI framework.
11. Use Font Awesome for UI icons.
12. Do not use emojis as standard icons.
13. Comfortaa is the primary UI font.
14. JetBrains Mono is for technical data.
15. Do not add external font/icon CDNs.
16. Preserve labels, keyboard behavior, focus and accessibility states.
17. Inspect Storybook before creating a new component.
18. Namespace custom data attributes `data-oj-*`.
19. Namespace public custom events `oj:*`.
20. Keep business logic out of the design system.

```text
Need a button?     → oj-button
Need an input?     → oj-input
Need a panel?      → oj-panel
Need tabs?         → oj-tabs
Need status?       → oj-status
Need a table?      → oj-table
Need a dialog?     → oj-dialog
Need an icon?      → Font Awesome
Need a color?      → use an oj token
Need app branding? → override --oj-accent
```
