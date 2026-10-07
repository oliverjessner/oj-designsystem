import { story } from './helpers.js';

export default { title: 'Components/Select' };
export const Native = story(
  `<div class="oj-field"><label class="oj-label" for="format">Export format</label><select class="oj-select" id="format"><option>WebP</option><option>JPEG</option><option>PNG</option><option>AVIF</option></select></div>`,
  'Prefer a native select: it provides platform keyboard interaction and accessible semantics.',
);
export const Disabled = story(
  `<div class="oj-field"><label class="oj-label" for="format-disabled">Managed format</label><select class="oj-select" id="format-disabled" disabled><option>PNG</option></select></div>`,
  'The native disabled state prevents editing.',
);
