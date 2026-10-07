import { story, icon } from './helpers.js';

export default { title: 'Components/Panel' };
export const Surfaces = story(
  `<div class="oj-grid"><section class="oj-panel"><h2 class="oj-heading-3">Default</h2><p class="oj-muted">A subtle grouped surface.</p></section><section class="oj-panel oj-panel-elevated"><h2 class="oj-heading-3">Elevated</h2><p class="oj-muted">A small increase in depth.</p></section><section class="oj-panel oj-panel-compact"><h2 class="oj-heading-3">Compact</h2><p class="oj-muted">Dense inspector content.</p></section></div>`,
  'Use panels only when grouping helps understanding.',
);
export const Interactive = story(
  `<a class="oj-panel oj-panel-interactive oj-link" href="#panel-details">View project details ${icon('arrow-right')}</a><p id="panel-details">Interactive panels use an actual link or button.</p>`,
  'The interaction element supplies keyboard behavior; a styled section alone is not a button.',
);
