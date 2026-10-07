import { story } from './helpers.js';

export default { title: 'Components/Tag' };
export const Taxonomy = story(
  `<div class="oj-cluster"><a class="oj-tag" href="#tag-research">Research</a><a class="oj-tag" href="#tag-utilities">Utilities</a><span class="oj-tag">Local-first</span></div><p id="tag-research">Research category destination.</p><p id="tag-utilities">Utilities category destination.</p>`,
  'Use links for category destinations and spans for noninteractive metadata.',
);
