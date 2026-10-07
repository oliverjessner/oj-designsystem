# BulkPixel reference analysis

Read-only audit, 7 October 2026. [Upstream](https://github.com/oliverjessner/BulkPixel), commit `777e1ecc22e6cf6c95f9c59f0fa01434c28795e5`. A clean shallow clone in `/tmp/oj-designsystem-references/BulkPixel` matches the local source; the local package lock has a pre-existing modification and was not touched.

## Visual evidence

`src/styles.css`, root: background `#0f1114`, elevated background `#161a1f`, panels `#1b2026`, borders `#2a3139` / `#39424d`, text `#e3e7ec`, muted `#9ba5b1`, soft `#7c8793`, accent `#22c55e`. A 14px shell gap, 16px panel padding and approximately 36px controls give a compact, useful rhythm. Panel radii 14px / control radii 10px and 120–140ms transitions are repeated. `statistics-grid` and `statistics-timeline` use mono for numbers. Native range/select/input, path display, badges, dashed dropzone and subdued action menus form the reusable vocabulary.

## Markup and behavior

`src/index.html` contains panel/header/section compositions, label/control associations, segmented format and resize choices, native range inputs, status announcements, dialogs, and preview and preset lists. Some radiogroups use buttons without full radio keyboard semantics; oj uses native radios instead. The decorative upload icon is replaced by Font Awesome.

`src/main.js` around `togglePresetActionMenu`, `closePresetActionMenus` and `handlePresetMenuKeydown`: menus update `aria-expanded`, close on outside clicks, focus the first item and handle Escape/Up/Down/Home/End. These are reusable behaviors independent of preset CRUD. Image inspector search/focus restoration illustrates the need for reliable focus management. Tauri dialog/invoke/file event APIs and the application state are domain/runtime code, never library dependencies.

## Abstraction decisions

Keep the neutral palette and dense rhythm; replace global element styling with opt-in `oj-*` components. Convert green hardcodes and positive color aliases into an independent accent and semantic status palette. Improve contrast, explicit focus outlines and reduced motion. Remove body overflow/user-select restrictions, panel gradients and large shadows; these belong to application layout or decoration. Comfortaa replaces IBM Plex Sans by request, while JetBrains Mono remains the technical face.

Shared candidates: button variants, native form controls and groups, radio segmented choices, panel, toolbar, menu, dialog, status, metrics, path, progress, empty state, dropzone presentation. Domain-only: image previews/metadata inspector, conversion settings, watched folder chain logic, fixed workspace columns, presets/data fetching, CLI usage metrics and native file handling. No consumer files were migrated.
