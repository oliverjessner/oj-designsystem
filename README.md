# oj-designsystem

A calm, compact, CSS-first UI library for desktop tools, browser applications and editorial websites. One family: Comfortaa for UI/content, JetBrains Mono for technical data, independent semantic statuses and one product accent. Framework-independent HTML, CSS and vanilla ESM; no React, Tailwind, router or application state.

## Install

```sh
npm install oj-designsystem
```

## Quick start

```js
import 'oj-designsystem/styles.css';
import { initOJ, toast } from 'oj-designsystem';

const cleanup = initOJ(); // after markup is mounted
// toast('Export completed', { type: 'success' });
// cleanup(); before removing the UI owned by this call
```

```html
<body class="oj-app">
  <section class="oj-panel oj-stack">
    <header class="oj-section-header">
      <h1 class="oj-heading-2">Investigation</h1>
      <button class="oj-button oj-button-primary">
        <i class="fa-solid fa-plus" aria-hidden="true"></i> New item
      </button>
    </header>
    <div class="oj-field">
      <label class="oj-label" for="search">Search</label>
      <input id="search" class="oj-input" type="search" />
    </div>
  </section>
</body>
```

`oj-app`, `oj-site` or `oj-root` opts into base typography, foreground/background and minimal reset. Components can also be used individually. No global body height/overflow/user-selection restrictions are imposed. CSS-only components do not need initialization. Bundlers support the JS CSS import above or `@import 'oj-designsystem/styles.css'` in their CSS entry; plain static websites use a copied stylesheet URL.

## Accent and themes

After importing the stylesheet:

```css
:root {
  --oj-accent: #7d34c5;
}
```

Green `#22c55e`, purple `#7d34c5`, blue, orange and red are demonstrated in Storybook. Derived states and a luminance-based contrasting foreground follow automatically in current browsers. Semantic danger/success/warning/info remain independent. Default is dark; explicit scopes use `data-oj-theme="dark"`. See [THEMING](docs/THEMING.md) for public/derived tokens, nesting and support.

## Typography and icons

Local unicode-subsetted variable WOFF2 fonts ship in `dist/assets/fonts/`, with `font-display: swap`: Comfortaa 400/500/600/700; JetBrains Mono 400/500/600 plus italic. No font network dependency. Comfortable UI sizes are 12/13px labels, 14px body and 16px reading text. Inspect the typography matrix in Storybook at desktop/mobile sizes.

Official `@fortawesome/fontawesome-free` core/solid/regular/brands CSS and WOFF2 files are included in `styles.css`; `fontawesome.css` is also exported separately. Icons retain the official `fa-*` classes. Icon-only actions need an accessible name:

```html
<button class="oj-icon-button" aria-label="Settings">
  <i class="fa-solid fa-gear" aria-hidden="true"></i>
</button>
```

Fonts/icons retain their own licenses: [THIRD-PARTY-NOTICES](THIRD-PARTY-NOTICES.md), with complete original notices in `dist/licenses/`.

## Components

Foundations: tokens, typography, links, divider, focus, motion, screenreader utility, subtle opt-in scrollbars and small layout primitives.

Controls/content: button variants, icon buttons, every native input type, textarea/select, checkbox/radio/switch/range, radio segmented choices, panels, navigation/breadcrumb/pagination, tables/lists, badges/tags/status, metrics, alerts/messages, progress/spinner/skeleton, empty state, dropzone presentation, path/code and native details. Editorial: opt-in prose, article/project cards, metadata/byline, callout/blockquote, site header/footer.

[COMPONENTS](docs/COMPONENTS.md) documents purpose, markup, variants, states and accessibility. [INVENTORY](docs/INVENTORY.md) records shared/domain boundaries and source evidence; [MIGRATION](docs/MIGRATION.md) maps each consumer without changing it.

## JavaScript components

```js
import {
  initTabs,
  initDropdowns,
  initTooltips,
  initDialogs,
  openDialog,
  closeDialog,
  confirmDialog,
  toast,
} from 'oj-designsystem';
```

Explicit scoped initialization is idempotent and returns cleanup. Tabs provide roving focus/arrows/Home/End; menus provide keyboard/outside/Escape dismissal; tooltips describe existing accessible triggers; native modal dialogs preserve focus; toasts stack, announce safely and pause dismissal on hover/focus. User strings are rendered with `textContent`. Public events use `oj:*`. [JS-API](docs/JS-API.md) describes all behavior/events and ownership.

## Website usage

```html
<header class="oj-site-header">…</header>
<main class="oj-container">
  <article class="oj-prose">
    <h1>Article title</h1>
    <p>Article content…</p>
  </article>
</main>
<footer class="oj-site-footer">…</footer>
```

Prose is opt-in and uses a readable 68ch measure. The consumer chooses page structure, branding, routes and navigation content. [JEKYLL](docs/JEKYLL.md) explains static asset copying with no Node runtime. Tauri/Electron need only their normal local bundler/assets, with no native-library assumptions in this package.

## Storybook and development

Node 22.12+ and npm. A lockfile pins the dependency graph.

```sh
npm install
npm run storybook         # builds package, starts on port 6006
npm run lint
npm run test
npm run build
npm run build-storybook
npx playwright install   # once for browser verification
npm run test:browser      # Chromium, Firefox and WebKit
npm run verify:package    # npm pack; checks exports, assets and notices
npm run verify:consumer   # separate packed-tarball installs and production builds
```

Storybook includes Introduction, foundation/type/token/icon stories, component states, website patterns, toolbar/settings/form/table patterns and complete DesktopTool/EditorialWebsite examples. Accent and viewport toolbars support visual review; the accessibility addon surfaces violations. Production package contains only distribution, docs and license/readme/changelog files.

[QUALITY](docs/QUALITY.md) records the release checks, browser versions, visual review, distribution measurements and verification limits.

[examples/vanilla](examples/vanilla) and [examples/website](examples/website) use the public package imports and built output. Run `npm run build` in this repository first, then `npm install && npm run dev` in an example. The verification script goes further by installing the actual packed artifact outside this repository.

## Accessibility

Native semantic elements, visible `:focus-visible`, labels/error associations, keyboard patterns, live regions and reduced motion aim at WCAG 2.2 AA. Public behavior and real-browser accessibility/contrast checks cover representative components and five accents. These checks do not certify consumer pages; consumers remain responsible for content, labels, meaningful status text, appropriate interaction semantics and their custom theme contrast. Use text with status dots; never encode status only through color. Compact controls expand for coarse pointers.

## AI agents and versioning

[AI-AGENTS](docs/AI-AGENTS.md) is the short integration guide and cheat sheet. [ARCHITECTURE](docs/ARCHITECTURE.md) describes module boundaries and design principles.

PATCH fixes bugs/visual details without breaking API; MINOR adds components/APIs; MAJOR breaks documented contracts. During 0.x, breaking changes receive an explicit new minor and migration note. [CHANGELOG](CHANGELOG.md) starts at 0.1.0. MIT for original code; third-party assets retain their included licenses.
