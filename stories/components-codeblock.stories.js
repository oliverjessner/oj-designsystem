import { story } from './helpers.js';

export default { title: 'Components/CodeBlock' };
export const Technical = story(
  `<pre class="oj-code-block"><code>import { initOJ, toast } from 'oj-designsystem';

const destroy = initOJ(document);
toast('Export completed', { type: 'success' });
// Call destroy() when the view is removed.</code></pre><p>Output directory: <span class="oj-path">/Users/example/exports/article-images/2026</span></p>`,
  'Technical strings use JetBrains Mono. Blocks can scroll horizontally without breaking the surrounding layout.',
);
