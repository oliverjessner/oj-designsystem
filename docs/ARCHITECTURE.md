# Architecture and public contract

`oj-designsystem` 0.1.0 is an original CSS-first library, built from consumer analysis rather than extracted application CSS. The public library has no UI framework runtime.

- `src/css`: tokens, local font rules, a scoped reset/base, typography, layout and component modules. `styles.css` includes all foundations/components and Font Awesome; individual tokens/fonts/icons exports are available.
- `src/js`: side-effect-free ESM behaviors. Initialization is explicit, scoped, idempotent and reversible. Native HTML handles forms, segmented radios, details/accordion and modal dialogs.
- `stories`: framework-independent HTML stories, patterns, desktop/editorial examples and the five accent presets.
- `scripts`: esbuild bundling/minification, deterministic asset/license copies, distribution checks and real packed-package consumer verification.
- `tests`: public behavior in jsdom and real browser keyboard/accessibility/responsive checks.
- `docs`: API, theming, source audit, migration and agent reference. Consumer application layout, routing and business rules remain outside the library.

## Stable conventions

Public classes/custom properties are `oj-*` / `--oj-*`; public data attributes/events are `data-oj-*` / `oj:*`. Font Awesome retains its official `fa-*` classes as a third-party namespace exception. Components have native states and a small set of semantic variants. All asset URLs are relative to the distribution and work without network access.

Default is dark. Set `--oj-accent` on the root or an explicitly themed subtree. Derived tokens must be redeclared on theme scopes to resolve their local accent. Status colors stay independent. An automatically chosen high-contrast accent foreground uses relative color luminance with a conservative fallback for older engines; muted/accent text is mixed with readable text rather than using raw accent for small copy.

Exports: `oj-designsystem`, `/styles.css`, `/tokens.css`, `/fonts.css`, `/fontawesome.css`, `/assets/*`. No automatic DOM initialization or global object. CSS is marked as a side effect; JS is tree-shakable. Fontsource is only a development asset source; its fonts and exact licenses are copied into the package. Font Awesome Free is the official npm dependency and its required CSS/webfonts are copied by the build.

## Design principles

1. Function over decoration.
2. Dense but readable.
3. Consistent before custom.
4. Native HTML first.
5. Accessibility by default.
6. Accent, not rebranding.
7. Components, not application architecture.
8. Calm interfaces.
9. No AI aesthetic.
10. One family, different products.

## Versioning

PATCH: fixes and visual corrections without breaking the API. MINOR: additive components/APIs. MAJOR: breaking markup, class, token or behavior contracts. During 0.x, breaking changes use a new minor and an explicit migration note; 1.0 will establish the long-term compatibility baseline. Changelog entries describe behavioral and visual impact.
