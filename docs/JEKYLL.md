# Static Jekyll integration

Node is needed only to acquire/copy build assets. The generated website is static and makes no font/icon CDN requests.

```sh
npm install oj-designsystem
mkdir -p assets/vendor/oj-designsystem
cp -R node_modules/oj-designsystem/dist/. assets/vendor/oj-designsystem/
```

Copy the **whole** distribution, including `assets/` and `licenses/`, to preserve relative font paths. Commit it if deployment has no Node build step, or perform the copy before `bundle exec jekyll build` in CI. Keep notices with distributed assets.

In a layout:

```html
<link
  rel="stylesheet"
  href="{{ '/assets/vendor/oj-designsystem/styles.css' | relative_url }}"
/>
<style>
  :root {
    --oj-accent: #7d34c5;
  }
</style>
<body class="oj-site">
  <!-- page-specific layout wraps oj-prose, oj-site-header and other components -->
  <script type="module">
    import { initOJ } from '{{ "/assets/vendor/oj-designsystem/index.js" | relative_url }}';
    initOJ();
  </script>
</body>
```

Use `relative_url` for sites under a `baseurl`. CSS font paths resolve relative to the stylesheet automatically. Omit the JavaScript import when using only CSS components. If the site already has a bundler, use normal package imports instead of copying. Browser imports cannot resolve the bare npm specifier without a bundler/import map; the static example deliberately imports the copied ESM URL.

## Big Numbers section and animation

Use the [Big Numbers markup](COMPONENTS.md#big-numbers-website-section) in a reusable include. Loop over consumer-owned metrics and escape every label, final value, target and formatting attribute. The display value is authored localized text (`1.000h`), while `data-oj-count-up` is an ungrouped numeric target (`1000`). Supply `data-oj-count-locale="de-DE"` and `data-oj-count-suffix="h"` to match that display during animation. Add `oj-big-number-suffix` for a separate, smaller `+`.

The existing copied-ESM `initOJ()` call above discovers these counters. For a section-only integration, import `initCountUps` from the same copied `index.js` URL and initialize the mounted section instead. Keep its cleanup handle before replacing the section. Neither path requires a page-specific animation script or font/CDN dependency; the library owns viewport detection, formatting, reduced-motion behavior and cleanup.
