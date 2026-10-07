# Working on oj-designsystem

Read docs/ARCHITECTURE.md and docs/AI-AGENTS.md first. This is a framework-independent HTML/CSS/ESM package, not an application.

Keep public selectors, properties, data attributes and events namespaced. Use native semantics, scoped styles, shared tokens, independent semantic colors and literal text for untrusted values. Do not add a UI framework, CDN runtime dependency or consumer business logic. Font Awesome's official fa-* namespace is the documented third-party exception.

Component changes need a corresponding story and API documentation. Interactive changes need public behavior/keyboard tests. Run npm run lint, npm test, npm run build, npm run build-storybook, npm run test:browser, npm run verify:package and npm run verify:consumer. Build output is generated and not committed. Do not migrate consumer repositories as part of routine library development.
