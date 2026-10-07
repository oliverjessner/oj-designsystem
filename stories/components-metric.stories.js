import { story } from './helpers.js';

export default { title: 'Components/Metric' };
export const Values = story(
  `<div class="oj-grid"><div class="oj-metric"><span class="oj-metric-label">Exported files</span><strong class="oj-metric-value">1,248</strong><span class="oj-helper">This month</span></div><div class="oj-panel oj-metric"><span class="oj-metric-label">Storage saved</span><strong class="oj-metric-value oj-mono">2.4 GB</strong><span class="oj-helper">Compared with source files</span></div><div class="oj-panel oj-metric"><span class="oj-metric-label">Revenue</span><strong class="oj-metric-value oj-mono">€12,450</strong><span class="oj-helper">Example value; no billing logic</span></div></div>`,
  'A metric is label + value. Add a panel for a metric card; calculations belong to the consumer.',
);
