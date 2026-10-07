import { story } from './helpers.js';

export default { title: 'Components/Accordion' };
export const NativeDisclosure = story(
  `<div class="oj-stack"><details class="oj-accordion" open><summary>Which formats are supported?</summary><div class="oj-accordion-body"><p>JPEG, PNG, WebP and AVIF are available in this example.</p></div></details><details class="oj-accordion"><summary>Does this preview upload files?</summary><div class="oj-accordion-body"><p>No. The example reads file names, types and sizes locally.</p></div></details></div>`,
  'Native details provides a named disclosure, Enter/Space activation and an open state without extra JavaScript.',
);
