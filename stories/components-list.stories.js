import { story } from './helpers.js';

export default { title: 'Components/List' };
export const BulletList = story(
  `<div class="oj-grid">
    <section class="oj-panel oj-stack">
      <h2 class="oj-heading-3">Bullet list</h2>
      <ul class="oj-bullet-list">
        <li>Preserve source files</li>
        <li>Inspect image dimensions</li>
        <li>Choose an output folder</li>
      </ul>
    </section>
    <section class="oj-panel oj-stack">
      <h2 class="oj-heading-3">Wrapping and inline content</h2>
      <ul class="oj-bullet-list">
        <li><strong>Keep originals.</strong> Store exported files in a separate folder so the source images remain available for future edits.</li>
        <li>Read the <a class="oj-link" href="#oj-bullet-list-nested">nested list example</a> before organizing related items.</li>
        <li>Technical values also wrap: <span class="oj-mono">original-photographs-with-full-resolution-and-preserved-source-metadata.webp</span></li>
      </ul>
    </section>
    <section class="oj-panel oj-stack">
      <h2 id="oj-bullet-list-nested" class="oj-heading-3">Nested list</h2>
      <ul class="oj-bullet-list">
        <li>Prepare the files
          <ul class="oj-bullet-list">
            <li>Inspect dimensions</li>
            <li>Keep source metadata</li>
          </ul>
        </li>
        <li>Review the exported results</li>
      </ul>
    </section>
  </div>`,
  'Native unordered lists with visible bullets, hanging text alignment and nested lists. Apply oj-bullet-list to each ul; links retain native keyboard behavior. No JavaScript is required.',
);
export const SemanticLists = story(
  `<div class="oj-grid"><section class="oj-panel"><h2 class="oj-heading-3">Simple list</h2><ul class="oj-list"><li class="oj-list-item">Preserve source files</li><li class="oj-list-item">Inspect image dimensions</li><li class="oj-list-item">Choose an output folder</li></ul></section><section class="oj-panel"><h2 class="oj-heading-3">Interactive list</h2><ul class="oj-list oj-list-interactive"><li><button class="oj-list-item" type="button">Article images <span class="oj-muted">24 files</span></button></li><li><button class="oj-list-item" type="button">Product photos <span class="oj-muted">16 files</span></button></li><li><button class="oj-list-item" type="button" disabled>Archived exports <span class="oj-muted">Unavailable</span></button></li></ul></section><section class="oj-panel"><h2 class="oj-heading-3">Key/value</h2><dl class="oj-key-value"><div><dt>Format</dt><dd class="oj-mono">WebP</dd></div><div><dt>Width</dt><dd class="oj-mono">1600 px</dd></div></dl></section><section class="oj-panel"><h2 class="oj-heading-3">Definitions</h2><dl class="oj-definition-list"><dt>Accent</dt><dd>A product color with derived interactive states.</dd><dt>Surface</dt><dd>A neutral container for related controls.</dd></dl></section></div>`,
  'Use list semantics for sequences, real buttons for actions and definition lists for term/value relationships.',
);
