import { story, icon } from './helpers.js';

export default { title: 'Patterns/EmptyState' };

export const FirstRun = story(
  `<section class="oj-panel"><header class="oj-section-header"><h2 class="oj-heading-3">History</h2><span class="oj-badge">0 exports</span></header><div class="oj-empty-state"><span class="oj-empty-state-icon">${icon('clock-rotate-left')}</span><h3 class="oj-empty-state-title">No exports yet</h3><p class="oj-empty-state-description">Completed batches will appear here after your first export.</p><div class="oj-empty-state-actions"><button class="oj-button oj-button-primary">Start a new batch</button></div></div></section>`,
  'Context stays visible around the empty state; the action points toward a useful next step.',
);
