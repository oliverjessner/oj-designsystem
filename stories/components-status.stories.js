import { story } from './helpers.js';

export default { title: 'Components/Status' };
export const Kinds = story(
  `<div class="oj-stack"><span class="oj-status"><span class="oj-status-dot" aria-hidden="true"></span>Idle</span><span class="oj-status oj-status-success"><span class="oj-status-dot" aria-hidden="true"></span>Running</span><span class="oj-status oj-status-warning"><span class="oj-status-dot" aria-hidden="true"></span>Review required</span><span class="oj-status oj-status-danger"><span class="oj-status-dot" aria-hidden="true"></span>Export failed</span><span class="oj-status oj-status-info"><span class="oj-status-dot" aria-hidden="true"></span>Waiting for input</span></div>`,
  'Every colored indicator includes human-readable text; the dot is decorative.',
);
