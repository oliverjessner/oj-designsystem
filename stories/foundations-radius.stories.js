import { story } from './helpers.js';

export default { title: 'Foundations/Radius' };
export const Scale = story(
  `<div class="oj-grid"><div class="oj-panel" style="border-radius: var(--oj-radius-sm)"><code>--oj-radius-sm</code></div><div class="oj-panel" style="border-radius: var(--oj-radius-md)"><code>--oj-radius-md</code></div><div class="oj-panel" style="border-radius: var(--oj-radius-lg)"><code>--oj-radius-lg</code></div><div class="oj-panel" style="border-radius: var(--oj-radius-full)"><code>--oj-radius-full</code></div></div>`,
  'Use the small set of radii consistently. The full radius is reserved for shapes such as status dots.',
);
