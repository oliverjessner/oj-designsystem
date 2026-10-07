import { story } from './helpers.js';

export default { title: 'Foundations/Shadows' };
export const Scale = story(
  `<div class="oj-grid"><div class="oj-panel" style="box-shadow: var(--oj-shadow-sm)"><code>--oj-shadow-sm</code></div><div class="oj-panel" style="box-shadow: var(--oj-shadow-md)"><code>--oj-shadow-md</code></div><div class="oj-panel" style="box-shadow: var(--oj-shadow-lg)"><code>--oj-shadow-lg</code></div><div class="oj-panel" style="box-shadow: var(--oj-shadow-dialog)"><code>--oj-shadow-dialog</code></div></div>`,
  'Shadows establish depth without glow or decorative color.',
);
