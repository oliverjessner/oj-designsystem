import { story } from './helpers.js';

export default { title: 'Components/Skeleton' };
export const LoadingSummary = story(
  `<section class="oj-panel oj-stack" aria-busy="true"><h2 class="oj-heading-3">Batch summary</h2><p class="oj-helper" role="status">Loading batch details…</p><div class="oj-skeleton" aria-hidden="true" style="width: 55%; height: 1.5rem"></div><div class="oj-skeleton" aria-hidden="true" style="width: 80%; height: 1rem"></div><div class="oj-skeleton" aria-hidden="true" style="width: 65%; height: 1rem"></div></section>`,
  'A restrained optional placeholder. Decorative blocks are hidden from assistive technology; visible text explains the loading state.',
);
