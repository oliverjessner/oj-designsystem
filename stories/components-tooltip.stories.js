import { story, icon } from './helpers.js';

export default { title: 'Components/Tooltip' };
export const NamedTrigger = story(
  `<div class="oj-cluster"><button class="oj-icon-button" aria-label="Export settings" data-oj-tooltip="Export settings">${icon('sliders')}</button><button class="oj-button oj-button-secondary" data-oj-tooltip="A short optional explanation">Hover or focus me</button></div>`,
  'Hover or focus shows supplementary text. Escape dismisses it. Essential instructions stay visible in the page.',
);
