import { story } from './helpers.js';

export default { title: 'Website/Header' };

export const Navigation = story(
  `<header class="oj-site-header"><div class="oj-container"><a class="oj-link" href="#site-home"><strong>Example Journal</strong></a><nav class="oj-nav" aria-label="Main navigation"><a class="oj-nav-link" href="#site-home" aria-current="page">Journal</a><a class="oj-nav-link" href="#projects">Projects</a><a class="oj-nav-link" href="#contact">Contact</a></nav><button class="oj-icon-button" aria-label="Search articles" data-oj-tooltip="Search articles"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></button></div></header><main id="site-home"><p class="oj-muted">Header content wraps at narrow widths. Consumer navigation uses real destinations and preserves visible focus.</p><div id="projects">Projects destination</div><div id="contact">Contact destination</div></main>`,
  'Header primitives support branding and responsive navigation without deciding the consumer information architecture.',
);
