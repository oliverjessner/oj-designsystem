import { story, icon } from './helpers.js';

export default { title: 'Components/Pagination' };
export const Archive = story(
  `<nav class="oj-pagination" aria-label="Archive pages"><a class="oj-button oj-button-ghost" href="#page-previous" aria-label="Previous page">${icon('chevron-left')}</a><a class="oj-button oj-button-ghost" href="#page-1" aria-current="page">1</a><a class="oj-button oj-button-ghost" href="#page-2">2</a><a class="oj-button oj-button-ghost" href="#page-3">3</a><a class="oj-button oj-button-ghost" href="#page-next" aria-label="Next page">${icon('chevron-right')}</a></nav>`,
  'Pagination is a labeled navigation landmark. aria-current identifies the active page; icon links have names.',
);
