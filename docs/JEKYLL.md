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
