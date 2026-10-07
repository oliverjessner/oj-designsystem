import { story } from './helpers.js';
import { table } from './samples.js';

export default { title: 'Patterns/DataTable' };

export const Inspector = story(
  `<div class="oj-demo-columns"><section class="oj-panel"><header class="oj-section-header"><h2 class="oj-heading-3">Export queue</h2><span class="oj-badge">2 files</span></header>${table}</section><aside class="oj-panel oj-stack" aria-label="Selected file details"><h2 class="oj-heading-3">File details</h2><dl class="oj-key-value"><div><dt>File</dt><dd class="oj-mono">article-header.jpg</dd></div><div><dt>Dimensions</dt><dd class="oj-mono">1600 × 900</dd></div><div><dt>Color profile</dt><dd class="oj-mono">sRGB</dd></div><div><dt>Output size</dt><dd class="oj-mono">124 KB</dd></div></dl><span class="oj-status oj-status-success"><span class="oj-status-dot" aria-hidden="true"></span>Ready to export</span></aside></div>`,
  'Data table plus detail inspector. Numeric data uses mono; definition lists retain semantic relationships.',
);
