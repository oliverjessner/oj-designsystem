import { story } from './helpers.js';

export default { title: 'Components/Slider' };
export const Quality = story(
  `<div class="oj-field"><label class="oj-label" for="quality">Quality</label><input class="oj-range" id="quality" type="range" min="1" max="100" value="80" aria-describedby="quality-help" /><p class="oj-helper" id="quality-help">80% initial value. Use Arrow keys for small adjustments.</p></div>`,
  'Native range behavior follows the selected accent.',
);
export const Disabled = story(
  `<div class="oj-field"><label class="oj-label" for="quality-disabled">Managed quality</label><input class="oj-range" id="quality-disabled" type="range" value="50" disabled /></div>`,
  'Disabled range retains its shape while signaling unavailability.',
);
