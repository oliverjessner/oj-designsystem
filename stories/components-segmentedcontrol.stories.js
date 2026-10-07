import { story } from './helpers.js';

export default { title: 'Components/SegmentedControl' };
export const ExclusiveChoice = story(
  `<fieldset class="oj-field"><legend class="oj-label">Output type</legend><div class="oj-segmented"><label><input type="radio" name="output-type" value="webp" checked /><span>WebP</span></label><label><input type="radio" name="output-type" value="jpeg" /><span>JPEG</span></label><label><input type="radio" name="output-type" value="png" /><span>PNG</span></label></div></fieldset>`,
  'An exclusive setting is a radio group, not navigation tabs. No library JavaScript is needed.',
);
