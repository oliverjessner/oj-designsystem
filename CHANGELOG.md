# Changelog

## Unreleased

- Add `createMultiselect` with searchable native checkbox choices, selection summaries, reset, keyboard navigation and viewport-aware panels. Includes option/value setters, localized plain-text labels, typed `oj:change` events, Storybook examples and public behavior/browser coverage. Extracted from Pitchary's tag filter without product texts, badges, filtering rules or dependencies.

## 0.2.0

- Add Section Intro, Hero / Display Headline, Split / CTA Section, Video Card and Steps website components with responsive compositions and local Storybook media. Optional `initVideoPreviews` provides muted viewport previews with native playback fallback, a keyboard pause/play control, reduced-motion handling and reversible cleanup; `initOJ` includes it.
- Add a responsive Big Numbers website section and scoped `initCountUps` animation with viewport triggering, locale/decimal/unit formatting, stable accessible values, reduced-motion fallback and reversible cleanup. `initOJ` discovers `data-oj-count-up` automatically.
- Add `oj-bullet-list` for native text lists with visible points, wrapped content and nested circle markers, including Storybook examples and API documentation.

## 0.1.0

- Initial original CSS-first design system for browser, desktop and static website consumers.
- Dark tokens, single accent API, local Comfortaa / JetBrains Mono, Font Awesome Free.
- Native controls, data/navigation/feedback components and opt-in editorial prose.
- Scoped, idempotent ESM tabs, menus, tooltips, dialog helpers and accessible toasts.
- HTML Storybook, source analysis, migration/agent guides and packed-package consumer checks.
