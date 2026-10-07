import { story } from './helpers.js';

export default { title: 'Foundations/Accent' };
export const Derived = story(
  `<div class="oj-grid"><div class="oj-story-swatch" style="background: var(--oj-accent)"><code>--oj-accent</code></div><div class="oj-story-swatch" style="background: var(--oj-accent-hover)"><code>--oj-accent-hover</code></div><div class="oj-story-swatch" style="background: var(--oj-accent-active)"><code>--oj-accent-active</code></div><div class="oj-story-swatch" style="background: var(--oj-accent-soft)"><code>--oj-accent-soft</code></div><div class="oj-story-swatch" style="background: var(--oj-accent-subtle)"><code>--oj-accent-subtle</code></div><div class="oj-story-swatch" style="background: var(--oj-accent-border)"><code>--oj-accent-border</code></div></div><div class="oj-cluster"><button class="oj-button oj-button-primary" >Primary action</button><span class="oj-badge oj-badge-accent">Product accent</span><span class="oj-status oj-status-danger"><span class="oj-status-dot" aria-hidden="true"></span>Danger stays independent</span></div>`,
  'Use the toolbar to change only --oj-accent. Derived colors follow automatically; status colors keep their meaning.',
);
