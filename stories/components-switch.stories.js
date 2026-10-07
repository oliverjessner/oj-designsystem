import { story } from './helpers.js';

export default { title: 'Components/Switch' };
export const States = story(
  `<div class="oj-stack"><label class="oj-switch"><input type="checkbox" role="switch" checked /><span class="oj-switch-track" aria-hidden="true"></span><span>Watch output folder</span></label><label class="oj-switch"><input type="checkbox" role="switch" /><span class="oj-switch-track" aria-hidden="true"></span><span>Launch at login</span></label><label class="oj-switch"><input type="checkbox" role="switch" disabled /><span class="oj-switch-track" aria-hidden="true"></span><span>Managed preference</span></label></div>`,
  'The switch is a checkbox, operable with Space. Visible text names each option.',
);
