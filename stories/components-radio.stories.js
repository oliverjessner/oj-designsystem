import { story } from './helpers.js';

export default { title: 'Components/Radio' };
export const Choices = story(
  `<fieldset class="oj-field"><legend class="oj-label">Resize mode</legend><label class="oj-check"><input class="oj-radio" name="resize-mode" type="radio" checked /> Fit within bounds</label><label class="oj-check"><input class="oj-radio" name="resize-mode" type="radio" /> Fixed width</label><label class="oj-check"><input class="oj-radio" name="resize-mode" type="radio" disabled /> Managed preset</label></fieldset>`,
  'A fieldset and legend name the group. Native radio keys choose one option.',
);
