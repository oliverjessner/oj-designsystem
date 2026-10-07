# External package consumers

Both examples import only the `oj-designsystem` package exports. Their dependency is `file:../..`, so the library must be built first. They do not import `src` or embed library styles.

```sh
npm install
npm run build
cd examples/vanilla # or examples/website
npm install
npm run dev
```

Use `npm run build` inside either example to verify production bundling. After changing library source, run the root build again and restart the consumer preview if needed. The package verification script also installs the packed tarball in a separate temporary consumer.

The compact desktop example has a searchable/sortable file queue, inspector, native controls, tabs, dropdown, tooltip, dialog, confirmation and toast. Adding files reads names, types and sizes locally. Export is a preview: no image conversion or upload occurs.

The editorial example has a responsive site header, article, byline, tags, code, table, blockquote, callout, article/project cards, search, native form and footer. The form validates locally; it does not transmit messages.
