import { story } from './helpers.js';

export default { title: 'Website/Callout' };

export const Context = story(
  `<div class="oj-stack"><aside class="oj-callout oj-callout-info" aria-label="Information"><strong>Local assets</strong><p>The package includes its fonts and icons for offline interfaces.</p></aside><aside class="oj-callout oj-callout-note" aria-label="Note"><strong>Implementation note</strong><p>Use application CSS for layout and domain-specific views.</p></aside><aside class="oj-callout oj-callout-warning" aria-label="Warning"><strong>Before deleting files</strong><p>Review the selected paths and keep a backup.</p></aside></div>`,
  'Callouts provide editorial context. Static notes do not need live-region roles.',
);
