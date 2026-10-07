import { story, icon } from './helpers.js';

export default { title: 'Components/Table' };
export const Standard = story(
  `<div class="oj-table-container" role="region" aria-label="Export queue" tabindex="0"><table class="oj-table oj-table-hover"><caption>Current export queue</caption><thead><tr><th scope="col" aria-sort="ascending"><button class="oj-table-sort" type="button">File ${icon('arrow-up')}</button></th><th scope="col">Format</th><th scope="col" class="oj-numeric">Size</th><th scope="col">Status</th></tr></thead><tbody><tr data-oj-state="selected"><td><button class="oj-button oj-button-ghost oj-button-compact">article-header.jpg</button></td><td class="oj-mono">WebP</td><td class="oj-numeric oj-mono">124 KB</td><td><span class="oj-status oj-status-success"><span class="oj-status-dot" aria-hidden="true"></span>Ready</span></td></tr><tr><td><button class="oj-button oj-button-ghost oj-button-compact">screenshot.png</button></td><td class="oj-mono">PNG</td><td class="oj-numeric oj-mono">842 KB</td><td><span class="oj-status oj-status-warning"><span class="oj-status-dot" aria-hidden="true"></span>Review</span></td></tr></tbody></table></div>`,
  'Sort display is a pattern: the consumer owns sorting. Real buttons make row actions accessible.',
);
export const Compact = story(
  `<div class="oj-table-container" role="region" aria-label="Export queue" tabindex="0"><table class="oj-table oj-table-compact oj-table-hover"><caption>Current export queue</caption><thead><tr><th scope="col" aria-sort="ascending"><button class="oj-table-sort" type="button">File ${icon('arrow-up')}</button></th><th scope="col">Format</th><th scope="col" class="oj-numeric">Size</th><th scope="col">Status</th></tr></thead><tbody><tr data-oj-state="selected"><td><button class="oj-button oj-button-ghost oj-button-compact">article-header.jpg</button></td><td class="oj-mono">WebP</td><td class="oj-numeric oj-mono">124 KB</td><td><span class="oj-status oj-status-success"><span class="oj-status-dot" aria-hidden="true"></span>Ready</span></td></tr><tr><td><button class="oj-button oj-button-ghost oj-button-compact">screenshot.png</button></td><td class="oj-mono">PNG</td><td class="oj-numeric oj-mono">842 KB</td><td><span class="oj-status oj-status-warning"><span class="oj-status-dot" aria-hidden="true"></span>Review</span></td></tr></tbody></table></div>`,
  'Compact rows preserve visible focus and a scrollable region.',
);
export const Empty = story(
  `<div class="oj-table-container"><table class="oj-table"><caption>Import queue</caption><thead><tr><th scope="col">File</th><th scope="col">Status</th></tr></thead><tbody><tr><td colspan="2"><div class="oj-empty-state"><h2 class="oj-empty-state-title">No files queued</h2><p class="oj-empty-state-description">Choose files to start a new export.</p></div></td></tr></tbody></table></div>`,
  'Empty content stays inside the table structure.',
);
