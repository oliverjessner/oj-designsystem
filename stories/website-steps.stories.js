import { story } from './helpers.js';

export default { title: 'Website/Steps' };

const items = `
  <li class="oj-step"><span class="oj-step-number" aria-hidden="true">01</span><h3 class="oj-step-title">Collect</h3><p class="oj-step-description">Gather relevant open sources and record where the material came from.</p></li>
  <li class="oj-step"><span class="oj-step-number" aria-hidden="true">02</span><h3 class="oj-step-title">Understand</h3><p class="oj-step-description">Structure the content and define the questions it can answer.</p></li>
  <li class="oj-step"><span class="oj-step-number" aria-hidden="true">03</span><h3 class="oj-step-title">Analyze</h3><p class="oj-step-description">Compare signals and describe patterns with their limitations.</p></li>
  <li class="oj-step"><span class="oj-step-number" aria-hidden="true">04</span><h3 class="oj-step-title">Validate</h3><p class="oj-step-description">Check the findings against the source material and independent evidence.</p></li>`;

export const Method = story(
  `<section class="oj-section" aria-labelledby="steps-method-title"><header class="oj-section-intro"><p class="oj-kicker">Method</p><h2 class="oj-section-title" id="steps-method-title">A clear sequence.</h2><p class="oj-lead">Four stages keep the question, evidence and findings connected.</p></header><ol class="oj-steps" role="list">${items}</ol></section>`,
  'A native ordered list adapts from a row to a grid or stack. Decorative numbers repeat the visible sequence without duplicating screen-reader content.',
);

export const Vertical = story(
  `<section class="oj-section" aria-labelledby="steps-vertical-title"><header class="oj-section-intro"><h2 class="oj-section-title" id="steps-vertical-title">From source to finding.</h2></header><ol class="oj-steps oj-steps-vertical" role="list">${items}</ol></section>`,
  'The vertical variant uses the same ordered list and adds an inline rule. It follows both left-to-right and right-to-left text direction.',
);
