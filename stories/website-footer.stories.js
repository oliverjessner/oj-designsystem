import { story } from './helpers.js';

export default { title: 'Website/Footer' };

export const Groups = story(
  `<footer class="oj-site-footer"><div class="oj-grid"><section><h2 class="oj-heading-4">Example Journal</h2><p class="oj-muted">Technology, research and useful tools.</p></section><nav class="oj-stack" aria-label="Journal links"><strong>Journal</strong><a class="oj-link" href="#archive">Archive</a><a class="oj-link" href="#rss">RSS feed</a></nav><nav class="oj-stack" aria-label="About links"><strong>About</strong><a class="oj-link" href="#contact">Contact</a><a class="oj-link" href="#privacy">Privacy</a></nav></div><hr class="oj-divider" /><small class="oj-small oj-muted">© 2026 Example Journal</small></footer>`,
  'Footer primitives group navigation and metadata while destinations and legal text stay with the consumer.',
);
