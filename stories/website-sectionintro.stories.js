import { story } from './helpers.js';

export default { title: 'Website/Section Intro' };

export const LeftAligned = story(
  `<section class="oj-section" aria-labelledby="intro-left-title">
    <header class="oj-section-intro">
      <p class="oj-kicker">Research practice</p>
      <h2 class="oj-section-title" id="intro-left-title">Clear questions. Useful findings.</h2>
      <p class="oj-lead">Combine open sources, structured analysis and careful validation to make complex systems easier to understand.</p>
    </header>
    <p class="oj-text oj-muted">The section content follows this introduction.</p>
  </section>`,
  'An eyebrow, heading and lead paragraph form a reusable website introduction. The heading level follows the page outline.',
);

export const Centered = story(
  `<section class="oj-section" aria-labelledby="intro-center-title">
    <header class="oj-section-intro oj-section-intro-center">
      <p class="oj-kicker">Selected work</p>
      <h2 class="oj-section-title" id="intro-center-title">Make room for the evidence.</h2>
      <p class="oj-lead">A centered introduction uses the same type scale and readable line length.</p>
    </header>
    <div class="oj-panel"><p class="oj-text">Add cards, media or a list below the introduction.</p></div>
  </section>`,
  'The centered variant changes alignment while keeping native headings and readable copy.',
);

export const Minimal = story(
  `<section class="oj-section" aria-labelledby="intro-minimal-title">
    <header class="oj-section-intro">
      <h2 class="oj-section-title" id="intro-minimal-title">Latest articles</h2>
    </header>
    <p class="oj-text">Eyebrow and lead copy are optional.</p>
  </section>`,
  'Use only the heading when additional introductory copy would repeat the content.',
);
