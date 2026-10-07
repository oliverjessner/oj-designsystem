# Themes and tokens

Dark is the default. Current browsers with `color-mix()` and relative colors are the target. The visual family comes from Comfortaa, JetBrains Mono, dense spacing, quiet surfaces and controlled geometry; product branding comes from one accent.

## Product accent

Load the library first, then set:

```css
:root {
  --oj-accent: #22c55e;
} /* BulkPixel */
/* :root { --oj-accent: #7d34c5; } // OJ website */
/* :root { --oj-accent: #3b82f6; } // Another tool */
```

No per-component color overrides are necessary. Hover/active backgrounds, soft/subtle fills, borders, readable accent text and primary-button foreground derive from `--oj-accent`. Relative-color luminance chooses a dark/light foreground, and color-mixed accent text remains legible on neutral surfaces. Semantic success/warning/danger/info do not follow branding.

A theme scope re-evaluates derived properties with its own accent:

```html
<section class="oj-root" data-oj-theme="dark" style="--oj-accent: #7d34c5">
  <button class="oj-button oj-button-primary">Save</button>
</section>
```

Use `data-oj-theme` for nested accents. Setting an accent only on a random descendant without a theme scope cannot re-evaluate custom properties inherited from an ancestor. Native dialogs inherit their DOM theme; toasts accept a root in the same scope. Each Storybook accent preset changes only `--oj-accent` on its theme scope.

## Public customization API

Consumers may override input/base tokens at their theme root. Use the smallest override that solves the need and verify contrast/responsiveness after changing them.

| Group         | Tokens                                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| Branding      | `--oj-accent`                                                                                                    |
| Fonts         | `--oj-font-sans`, `--oj-font-mono`                                                                               |
| Canvas        | `--oj-bg`, `--oj-bg-elevated`                                                                                    |
| Surfaces      | `--oj-surface`, `--oj-surface-hover`, `--oj-surface-active`                                                      |
| Borders       | `--oj-border-subtle`, `--oj-border`, `--oj-border-strong`, `--oj-border-control`                                 |
| Text          | `--oj-text`, `--oj-text-muted`, `--oj-text-soft`, `--oj-text-disabled`                                           |
| Semantics     | `--oj-success`, `--oj-warning`, `--oj-danger`, `--oj-info`                                                       |
| Type scale    | `--oj-text-xs`, `--oj-text-sm`, `--oj-text-md`, `--oj-text-lg`, `--oj-text-xl`, `--oj-text-2xl`, `--oj-text-3xl` |
| Leading       | `--oj-leading-tight`, `--oj-leading-normal`, `--oj-leading-relaxed`                                              |
| Weights       | `--oj-weight-normal` (400), `--oj-weight-medium` (500), `--oj-weight-semibold` (600), `--oj-weight-bold` (700)   |
| Spacing       | `--oj-space-1` through `--oj-space-6`, then `--oj-space-8`, `--oj-space-10`, `--oj-space-12`                     |
| Radius        | `--oj-radius-sm`, `--oj-radius-md`, `--oj-radius-lg`, `--oj-radius-full`                                         |
| Shadow        | `--oj-shadow-sm`, `--oj-shadow-md`, `--oj-shadow-lg`, `--oj-shadow-dialog`                                       |
| Motion        | `--oj-duration-fast`, `--oj-duration-normal`, `--oj-duration-slow`, `--oj-ease`                                  |
| Layers        | `--oj-z-dropdown`, `--oj-z-sticky`, `--oj-z-overlay`, `--oj-z-dialog`, `--oj-z-tooltip`, `--oj-z-toast`          |
| Density       | `--oj-control-height` (2.25rem), `--oj-control-height-compact` (2rem); coarse-pointer defaults are 2.75rem       |
| Width         | `--oj-content-width` (72rem), `--oj-prose-width` (68ch)                                                          |
| Focus         | `--oj-focus-color`, `--oj-focus-width` (2px), `--oj-focus-offset` (3px)                                          |
| Layout inputs | `--oj-gap` (local spacing override), `--oj-grid-min` (minimum grid track; default 16rem)                         |

The exact source defaults live in `src/css/tokens.css`; the standalone `oj-designsystem/tokens.css` export lets consumers use this vocabulary without all component CSS. `fonts.css` and `fontawesome.css` are likewise separately exported. `styles.css` includes all of them, so do not import them twice when using the full bundle.

## Derived and internal tokens

Consume these for custom domain components; normally do not override them:

- `--oj-accent-hover`, `--oj-accent-active`, `--oj-accent-soft`, `--oj-accent-subtle`, `--oj-accent-border`, `--oj-accent-text`, `--oj-accent-foreground`, `--oj-accent-hover-foreground`, `--oj-accent-active-foreground`.
- Semantic `--oj-success-soft`, `--oj-warning-soft`, `--oj-danger-soft`, `--oj-info-soft` and their readable text derivatives, where present.
- Component-local properties: these are implementation details unless explicitly listed as customization inputs in the component docs.

Overriding derived values individually breaks the single-accent contract and may lower contrast. Only use a documented foreground override if supporting an older engine outside the current-browser target. Font Awesome's official `--fa-*` tokens belong to the upstream icon API, not oj's theme contract.

## Dark theme and future light mode

`data-oj-theme="dark"` explicitly establishes a theme scope; it does not switch application state. A light preset is not included in 0.1.0. The neutral token vocabulary permits a future light theme without separate component implementations. If experimenting with light colors now, override the complete related neutral/focus/control/semantic palette and audit it; changing only the page background is insufficient.

## Density, focus and motion

Controls use compact desktop sizing and larger coarse-pointer targets. Prose gets a larger, relaxed reading context without changing the controls. App layouts remain consumer-owned. Focus uses a high-contrast visible ring independent of weak arbitrary accent colors. Reduced-motion media overrides the library's animation and transitions. Layer values express menu/sticky/overlay/dialog/toast ordering; native dialog also uses the browser's top layer.

Test product/custom theme combinations in Storybook and with `npm run test:browser`. Five provided accents are checked in representative real-browser fixtures; new custom colors, third-party content and arbitrary token overrides remain consumer verification work.
