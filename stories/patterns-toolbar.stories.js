import { story, icon } from './helpers.js';
import { dropdown } from './samples.js';

export default { title: 'Patterns/Toolbar' };

export const Actions = story(
  `<div class="oj-toolbar"><div class="oj-inline"><button class="oj-button oj-button-primary">${icon('folder-open')} Add files</button><span class="oj-muted">24 selected</span></div><div class="oj-cluster"><button class="oj-button oj-button-ghost">${icon('filter')} Filter</button>${dropdown}</div></div>`,
  'Toolbars distribute actions and wrap at narrow widths. Dropdown behavior uses the scoped story initializer.',
);
