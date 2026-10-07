import { story, icon } from './helpers.js';

export default { title: 'Patterns/SearchToolbar' };

export const FilterFiles = story(
  `<div class="oj-toolbar"><div class="oj-field"><label class="oj-label" for="toolbar-search">Search files</label><div class="oj-input-group"><input class="oj-input" id="toolbar-search" type="search" placeholder="File name or format" /><button class="oj-icon-button" type="button" aria-label="Clear file search" data-clear>${icon('xmark')}</button></div></div><div class="oj-field"><label class="oj-label" for="toolbar-format">Format</label><select class="oj-select" id="toolbar-format"><option>All formats</option><option>WebP</option><option>PNG</option></select></div><span class="oj-status oj-status-info"><span class="oj-status-dot" aria-hidden="true"></span>24 files</span></div>`,
  'Search keeps its label visible and an explicitly named clear action. Filtering belongs to the consumer.',
  (root) => {
    root.querySelector('[data-clear]').addEventListener('click', () => {
      const input = root.querySelector('input');
      input.value = '';
      input.focus();
    });
  },
);
