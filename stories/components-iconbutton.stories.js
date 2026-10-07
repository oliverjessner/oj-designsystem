import { story, icon } from './helpers.js';

export default { title: 'Components/IconButton' };
export const Actions = story(
  `<div class="oj-cluster"><button class="oj-icon-button" aria-label="Settings" data-oj-tooltip="Settings">${icon('gear')}</button><button class="oj-icon-button" aria-label="Remove item">${icon('trash')}</button><button class="oj-icon-button" aria-label="Refresh" disabled>${icon('rotate')}</button></div>`,
  'Icon-only actions always have an accessible name. Focus the settings button to preview its tooltip.',
);
