import { story, icon } from './helpers.js';

export default { title: 'Patterns/AppHeader' };

export const Utility = story(
  `<header class="oj-toolbar oj-panel"><div class="oj-inline">${icon('layer-group')}<strong>Image workspace</strong><span class="oj-badge">Local</span></div><div class="oj-inline"><span class="oj-status oj-status-success"><span class="oj-status-dot" aria-hidden="true"></span>Ready</span><button class="oj-icon-button" aria-label="Workspace settings" data-oj-tooltip="Workspace settings">${icon('gear')}</button></div></header>`,
  'Compact branding, status and one settings action compose a tool header without a fixed application shell.',
);
