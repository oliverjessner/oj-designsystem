import { story } from './helpers.js';

export default { title: 'Components/Badge' };
export const Kinds = story(
  `<div class="oj-cluster"><span class="oj-badge">Neutral</span><span class="oj-badge oj-badge-accent">Accent</span><span class="oj-badge oj-badge-success">Success</span><span class="oj-badge oj-badge-warning">Warning</span><span class="oj-badge oj-badge-danger">Danger</span><span class="oj-badge oj-badge-info">Info</span></div>`,
  'Badges are small semantic labels, not general-purpose containers.',
);
