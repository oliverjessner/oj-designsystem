import { story, icon } from './helpers.js';

export default { title: 'Website/ProjectCard' };

export const Tool = story(
  `<article class="oj-card oj-project-card"><div class="oj-card-body"><p class="oj-kicker">Open-source utility</p><h2 class="oj-card-title">Image workspace</h2><p class="oj-muted">A local tool for importing, inspecting and exporting image batches.</p><div class="oj-cluster"><span class="oj-tag">macOS</span><span class="oj-tag">Local-first</span><span class="oj-badge">MIT</span></div><div class="oj-card-actions"><a class="oj-button oj-button-primary" href="#project-download">${icon('download')} Download</a><a class="oj-button oj-button-ghost" href="#project-source">${icon('code')} Source</a></div></div></article><p id="project-download">Example download destination.</p><p id="project-source">Example source destination.</p>`,
  'Project cards compose the same card primitives with technical tags and direct actions.',
);
