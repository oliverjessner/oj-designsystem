import { story, icon } from './helpers.js';

export default { title: 'Components/EmptyState' };
export const WithAction = story(
  `<div class="oj-empty-state"><span class="oj-empty-state-icon">${icon('folder-open')}</span><h2 class="oj-empty-state-title">No files imported</h2><p class="oj-empty-state-description">Choose images to create your first batch.</p><button class="oj-button oj-button-primary" >Choose files</button></div>`,
  'A compact explanation with one clear action.',
);
export const Filtered = story(
  `<div class="oj-empty-state"><h2 class="oj-empty-state-title">No matching items</h2><p class="oj-empty-state-description">Try a broader search or clear your filters.</p><button class="oj-button oj-button-secondary" >Clear filters</button></div>`,
  'Explain how the user can recover from the empty state.',
);
