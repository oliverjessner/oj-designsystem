import { story } from './helpers.js';

export default { title: 'Components/Spinner' };
export const Loading = story(
  `<p class="oj-inline"><span class="oj-spinner" aria-hidden="true"></span><span role="status">Reading metadata…</span></p>`,
  'A small spinner accompanies a textual status; it does not replace an accessible label.',
);
