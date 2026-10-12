import { story } from './helpers.js';
import overview from './assets/overview.svg';

export default { title: 'Website/Split Section' };

const content = (suffix) => `
  <div class="oj-split-section-copy">
    <header class="oj-section-intro">
      <p class="oj-kicker">From question to finding</p>
      <h2 class="oj-section-title" id="split-${suffix}-title">Make complex systems readable.</h2>
      <p class="oj-lead">Connect the evidence, explain the limits and give the next decision a useful foundation.</p>
    </header>
    <ul class="oj-bullet-list"><li>Start with a specific question</li><li>Validate the source material</li><li>Explain findings in context</li></ul>
    <div class="oj-split-section-actions"><a class="oj-button oj-button-primary" href="#split-${suffix}-contact">Start a conversation</a></div>
  </div>
  <figure class="oj-split-section-media"><img src="${overview}" alt="Illustration of organized research material" width="720" height="540" loading="lazy" decoding="async"></figure>`;

export const TextAndMedia = story(
  `<section class="oj-split-section" aria-labelledby="split-default-title"><div class="oj-split-section-grid">${content('default')}</div></section><p id="split-default-contact" class="oj-muted">Contact destination</p>`,
  'A text/media composition with existing section intro, bullet list and buttons. Columns stack according to available section width.',
);

export const Reversed = story(
  `<section class="oj-split-section oj-split-section-reverse" aria-labelledby="split-reverse-title"><div class="oj-split-section-grid">${content('reverse')}</div></section><p id="split-reverse-contact" class="oj-muted">Contact destination</p>`,
  'Media appears before the text visually on wide sections. On narrow sections the original copy-first reading order remains; the example media is noninteractive.',
);

export const CallToAction = story(
  `<section class="oj-split-section oj-split-section-callout" aria-labelledby="split-cta-title"><div class="oj-split-section-grid">${content('cta')}</div></section><p id="split-cta-contact" class="oj-muted">Contact destination</p>`,
  'An elevated, bordered CTA variant uses the same composition and shared tokens. Copy, destinations and media remain consumer-owned.',
);
