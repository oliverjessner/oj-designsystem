import { story } from './helpers.js';
import overview from './assets/overview.svg';

export default { title: 'Website/Hero' };

export const WithMedia = story(
  `<section class="oj-hero" aria-labelledby="hero-media-title">
    <div class="oj-hero-grid">
      <div class="oj-hero-copy">
        <p class="oj-kicker">Independent research</p>
        <h1 class="oj-display" id="hero-media-title">Understand technology. <span class="oj-display-accent">Build useful things.</span></h1>
        <p class="oj-lead">Turn open sources and careful analysis into a clear view of digital products and platforms.</p>
        <div class="oj-hero-actions">
          <a class="oj-button oj-button-primary" href="#hero-media-contact">Discuss a project</a>
          <a class="oj-button oj-button-secondary" href="#hero-media-work">Explore the work</a>
        </div>
      </div>
      <figure class="oj-hero-media">
        <img src="${overview}" alt="Illustration of a research overview with three analysis panels" width="720" height="540" fetchpriority="high" decoding="async">
      </figure>
    </div>
  </section>
  <div class="oj-stack"><p id="hero-media-contact" class="oj-muted">Project contact destination</p><p id="hero-media-work" class="oj-muted">Selected work destination</p></div>`,
  'A display headline, lead copy, native action links and local media. Columns follow the section width, so a narrow embedded hero also stacks.',
);

export const Centered = story(
  `<section class="oj-hero oj-hero-center" aria-labelledby="hero-center-title">
    <div class="oj-hero-grid">
      <div class="oj-hero-copy">
        <p class="oj-kicker">Tools for thoughtful work</p>
        <h1 class="oj-display" id="hero-center-title">Calm interfaces for <span class="oj-display-accent">complex questions.</span></h1>
        <p class="oj-lead">A centered, text-only hero keeps the message and the next action together.</p>
        <div class="oj-hero-actions"><a class="oj-button oj-button-primary" href="#hero-center-guide">Read the guide</a></div>
      </div>
    </div>
  </section>
  <p id="hero-center-guide" class="oj-muted">Guide destination</p>`,
  'The centered variant remains a single column with or without media. Accent text follows the local product theme.',
);

export const DisplayHeadline = story(
  `<div class="oj-stack">
    <h1 class="oj-display">A larger headline with a <span class="oj-display-accent">clear point.</span></h1>
    <p class="oj-lead">The standalone display class can be used outside a hero on the correct heading level.</p>
  </div>`,
  'Use oj-display independently. Override --oj-display-size and --oj-display-width when a specific composition needs a different size or measure.',
);
