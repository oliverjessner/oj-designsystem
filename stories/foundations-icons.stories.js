import { story, icon } from './helpers.js';

export default { title: 'Foundations/Icons' };
export const Vocabulary = story(
  `<div class="oj-grid"><div class="oj-inline">${icon('folder-open')} <span>Open folder</span></div><div class="oj-inline">${icon('download')} <span>Export</span></div><div class="oj-inline">${icon('gear')} <span>Settings</span></div><div class="oj-inline">${icon('magnifying-glass')} <span>Search</span></div><div class="oj-inline">${icon('filter')} <span>Filter</span></div><div class="oj-inline">${icon('trash')} <span>Remove</span></div><div class="oj-inline">${icon('check')} <span>Success</span></div><div class="oj-inline">${icon('triangle-exclamation')} <span>Warning</span></div><div class="oj-inline">${icon('circle-info')} <span>Information</span></div></div>`,
  'Font Awesome Free is bundled locally. Text names the action; decorative icons have aria-hidden=true.',
);
