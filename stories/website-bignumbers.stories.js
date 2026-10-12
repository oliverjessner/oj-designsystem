import { initCountUps } from 'oj-designsystem';
import { story } from './helpers.js';

export default { title: 'Website/Big Numbers' };

const metrics = (animate = false) => `
  <section class="oj-big-number-section" aria-label="Research in numbers">
    <dl class="oj-big-number-list">
      <div class="oj-big-number">
        <dt class="oj-big-number-label">Hours of video reviewed</dt>
        <dd class="oj-big-number-value"><span ${animate ? 'data-oj-count-up="1000" data-oj-count-locale="de-DE" data-oj-count-suffix="h"' : ''}>1.000h</span><span class="oj-big-number-suffix">+</span></dd>
      </div>
      <div class="oj-big-number">
        <dt class="oj-big-number-label">Texts and transcripts reviewed</dt>
        <dd class="oj-big-number-value"><span ${animate ? 'data-oj-count-up="30000" data-oj-count-locale="de-DE" data-oj-count-delay="90"' : ''}>30.000</span><span class="oj-big-number-suffix">+</span></dd>
      </div>
      <div class="oj-big-number">
        <dt class="oj-big-number-label">Websites evaluated</dt>
        <dd class="oj-big-number-value"><span ${animate ? 'data-oj-count-up="10000" data-oj-count-locale="de-DE" data-oj-count-delay="180"' : ''}>10.000</span><span class="oj-big-number-suffix">+</span></dd>
      </div>
    </dl>
  </section>`;

export const Animated = story(
  `${metrics(true)}<button class="oj-button oj-button-secondary" type="button" data-oj-replay-counts>Replay animation</button>`,
  'Illustrative research totals. Numbers count up once when visible, with small per-item delays. Final values remain readable without JavaScript and with reduced motion.',
  (root) => {
    const section = root.querySelector('.oj-big-number-section');
    const button = root.querySelector('[data-oj-replay-counts]');
    let cleanup = initCountUps(section);
    const replay = () => {
      cleanup();
      cleanup = initCountUps(section);
    };
    button.addEventListener('click', replay);
    return () => {
      button.removeEventListener('click', replay);
      cleanup();
    };
  },
);

export const Static = story(
  metrics(),
  'The same semantic definition list without animation attributes. Values sit above their labels; the grid adapts to its available width.',
);

export const Formats = story(
  `<section class="oj-big-number-section" aria-label="Example formatted metrics">
    <dl class="oj-big-number-list">
      <div class="oj-big-number">
        <dt class="oj-big-number-label">Availability</dt>
        <dd class="oj-big-number-value"><span data-oj-count-up="99.9" data-oj-count-locale="de-DE" data-oj-count-suffix="%">99,9%</span></dd>
      </div>
      <div class="oj-big-number">
        <dt class="oj-big-number-label">Example budget</dt>
        <dd class="oj-big-number-value"><span data-oj-count-up="12450" data-oj-count-locale="de-DE" data-oj-count-prefix="€">€12.450</span></dd>
      </div>
      <div class="oj-big-number">
        <dt class="oj-big-number-label">Large totals wrap in narrow containers</dt>
        <dd class="oj-big-number-value"><span data-oj-count-up="1234567890" data-oj-count-locale="de-DE">1.234.567.890</span></dd>
      </div>
    </dl>
  </section>`,
  'Supply raw numeric targets separately from the final localized HTML. Prefixes, suffixes, decimals, duration and delay are optional data attributes; values are illustrative.',
);
