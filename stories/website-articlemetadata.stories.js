import { story } from './helpers.js';

export default { title: 'Website/ArticleMetadata' };

export const Byline = story(
  `<div class="oj-stack"><p class="oj-byline">By <a class="oj-link" href="#author">Example Author</a> · <time datetime="2026-10-07">7 October 2026</time> · 6 min read</p><div class="oj-card-meta"><span class="oj-tag">Engineering</span><span>Updated <time datetime="2026-10-07">7 October 2026</time></span></div><p id="author" class="oj-muted">Author profile destination. The consumer calculates reading time and supplies dates.</p></div>`,
  'Semantic time elements and a clear byline provide readable metadata without a content model dependency.',
);
