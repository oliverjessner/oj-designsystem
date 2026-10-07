import { story } from './helpers.js';

export default { title: 'Website/Prose' };

export const Article = story(
  `<article class="oj-prose"><p class="oj-kicker">Engineering notes</p><h1>Quiet interfaces for useful tools</h1><p>When an interface carries many controls, calm typography and predictable spacing help people stay with the task. Comfortaa gives the family a distinct voice without changing the meaning of familiar controls.</p><h2>Start with the native element</h2><p>A button should behave like a button. A checkbox should remain a checkbox. The shared library supplies a consistent appearance, while the browser supplies dependable interaction.</p><ul><li>Keep labels visible.</li><li>Use <a href="#tokens">design tokens</a> for color and spacing.</li><li>Provide text when a status changes.</li></ul><h3 id="tokens">A small API</h3><pre><code>import 'oj-designsystem/styles.css';
import { initOJ } from 'oj-designsystem';

const destroy = initOJ();</code></pre><p>Technical data uses <code>JetBrains Mono</code>. Long lines in code blocks can scroll without widening the article.</p><blockquote><p>Consistency makes room for the content.</p></blockquote><h4>Review before release</h4><ol><li>Test with the keyboard.</li><li>Switch the product accent.</li><li>Read at mobile width.</li></ol><table><caption>Example interface review</caption><thead><tr><th scope="col">Check</th><th scope="col">Result</th></tr></thead><tbody><tr><td>Keyboard access</td><td>Verified</td></tr><tr><td>Small labels</td><td>Reviewed at 12–16px</td></tr></tbody></table><figure><div class="oj-demo-media"><span>Example figure: neutral grouped surfaces</span></div><figcaption>A caption describes the figure without repeating the entire article.</figcaption></figure><p>A scoped prose component keeps these reading styles inside the article.</p></article>`,
  'Opt-in prose covers headings, lists, links, code, blockquotes, tables, figures and captions within a readable line length.',
);
