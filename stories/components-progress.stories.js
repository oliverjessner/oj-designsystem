import { story } from './helpers.js';

export default { title: 'Components/Progress' };
export const Determinate = story(
  `<div class="oj-field"><label class="oj-label" for="export-progress">Export progress</label><progress class="oj-progress" id="export-progress" max="100" value="64">64%</progress><p class="oj-helper">16 of 25 files exported · 64%</p></div>`,
  'Native progress exposes its value; text explains the operation.',
);
export const Indeterminate = story(
  `<div class="oj-field"><label class="oj-label" for="checking-progress">Checking files</label><progress class="oj-progress" id="checking-progress" max="100">Checking files</progress><p class="oj-helper">Checking files; progress is not yet known.</p></div>`,
  'Omitting value creates indeterminate progress. Reduced motion keeps an understandable static state.',
);
export const IndeterminateBar = story(
  `<div class="oj-stack"><p class="oj-label">Preparing export</p><div class="oj-progress oj-progress-indeterminate" role="progressbar" aria-label="Preparing export" aria-valuemin="0" aria-valuemax="100"></div><p class="oj-helper">Progress is not yet known. Reduced motion preserves a static indicator.</p></div>`,
  'The optional indeterminate bar uses an accessible progressbar name and omits aria-valuenow while its value is unknown.',
);
