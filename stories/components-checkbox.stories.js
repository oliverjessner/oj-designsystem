import { story } from './helpers.js';

export default { title: 'Components/Checkbox' };
export const Choices = story(
  `<div class="oj-stack"><label class="oj-check"><input class="oj-checkbox" type="checkbox" checked /> Preserve metadata</label><label class="oj-check"><input class="oj-checkbox" type="checkbox" /> Keep original files</label><label class="oj-check"><input class="oj-checkbox" type="checkbox" disabled /> Restricted setting</label></div>`,
  'Checkbox choices are independent; labels include the native control.',
);
