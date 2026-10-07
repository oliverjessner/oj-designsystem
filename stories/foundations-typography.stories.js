import { story } from './helpers.js';

export default { title: 'Foundations/Typography' };
export const Scale = story(
  `<div class="oj-stack"><h1 class="oj-heading-1">Heading one</h1><h2 class="oj-heading-2">Heading two</h2><h3 class="oj-heading-3">Heading three</h3><h4 class="oj-heading-4">Heading four</h4><p>Body text provides a clear, measured reading rhythm.</p><small class="oj-small">Small text for supplementary context.</small><p class="oj-muted">Muted text remains legible.</p><p class="oj-soft">Soft text carries secondary details.</p><p class="oj-mono">WebP · 1600 × 900 · 124 KB</p><p class="oj-kicker">Research notes</p><p class="oj-caption">Figure 1. Output size comparison.</p></div>`,
  'Comfortaa is the house font; JetBrains Mono is for technical data.',
);
export const Readability = story(
  `<div class="oj-stack"><div style="font-size: 12px; line-height: var(--oj-leading-normal)"><strong>12px Comfortaa</strong><p>Project settings · Quality · Selected files · Export folder · €12,450 · 1600 × 900</p></div><div style="font-size: 13px; line-height: var(--oj-leading-normal)"><strong>13px Comfortaa</strong><p>Project settings · Quality · Selected files · Export folder · €12,450 · 1600 × 900</p></div><div style="font-size: 14px; line-height: var(--oj-leading-normal)"><strong>14px Comfortaa</strong><p>Project settings · Quality · Selected files · Export folder · €12,450 · 1600 × 900</p></div><div style="font-size: 16px; line-height: var(--oj-leading-normal)"><strong>16px Comfortaa</strong><p>Project settings · Quality · Selected files · Export folder · €12,450 · 1600 × 900</p></div><div class="oj-field"><label class="oj-label" for="readability-input">Navigation label</label><input class="oj-input" id="readability-input" value="Article image exports" /></div></div>`,
  'Inspect 12/13px labels and 14/16px text at desktop and mobile viewports. Verify long labels, numbers and native input text.',
);
