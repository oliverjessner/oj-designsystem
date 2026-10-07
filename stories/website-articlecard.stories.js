import { story, icon } from './helpers.js';

export default { title: 'Website/ArticleCard' };

export const Editorial = story(
  `<div class="oj-grid"><article class="oj-card oj-article-card"><div class="oj-card-media oj-demo-media">${icon('newspaper')}</div><div class="oj-card-body"><p class="oj-kicker">Engineering</p><h2 class="oj-card-title"><a class="oj-link" href="#article-detail">A smaller interface can carry more information</a></h2><p class="oj-muted">A practical review of labels, density and native controls.</p><p class="oj-card-meta"><time datetime="2026-10-07">7 October 2026</time><span>6 min read</span></p></div></article><article class="oj-card oj-article-card"><div class="oj-card-body"><p class="oj-kicker">Research</p><h2 class="oj-card-title"><a class="oj-link" href="#article-detail">Make evidence visible</a></h2><p class="oj-muted">A card can work without media when its title and metadata carry the story.</p><p class="oj-card-meta"><time datetime="2026-10-06">6 October 2026</time><span>4 min read</span></p></div></article></div><p id="article-detail">Article cards use one clear title link, avoiding nested interactions.</p>`,
  'Optional media, metadata and excerpt support editorial content without hardcoded taxonomy or branding.',
);
