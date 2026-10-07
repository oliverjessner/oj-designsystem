import { story, icon } from './helpers.js';

export default { title: 'Components/Alert' };
export const Kinds = story(
  `<div class="oj-stack"><div class="oj-alert oj-alert-info"><strong>Local processing</strong><p>Files stay on this device.</p></div><div class="oj-alert oj-alert-success"><strong>Export completed</strong><p>24 files were written successfully.</p></div><div class="oj-alert oj-alert-warning"><strong>Review output folder</strong><p>Existing names may be replaced.</p></div><div class="oj-alert oj-alert-danger"><strong>Could not write files</strong><p>Choose a writable output folder and retry.</p></div></div>`,
  'Static alerts are content. Add role=status or role=alert only for dynamically inserted feedback.',
);
export const Inline = story(
  `<p class="oj-inline-message oj-inline-message-warning">${icon('triangle-exclamation')} This destination contains existing files.</p>`,
  'Inline messages explain the immediate context without a large panel.',
);
