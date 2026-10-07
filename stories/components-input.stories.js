import { story } from './helpers.js';

export default { title: 'Components/Input' };
export const Types = story(
  `<div class="oj-grid"><div class="oj-field"><label class="oj-label" for="input-text">Text</label><input class="oj-input" id="input-text" type="text"  /></div><div class="oj-field"><label class="oj-label" for="input-search">Search</label><input class="oj-input" id="input-search" type="search"  /></div><div class="oj-field"><label class="oj-label" for="input-password">Password</label><input class="oj-input" id="input-password" type="password"  /></div><div class="oj-field"><label class="oj-label" for="input-number">Number</label><input class="oj-input" id="input-number" type="number" value="42" /></div><div class="oj-field"><label class="oj-label" for="input-url">Url</label><input class="oj-input" id="input-url" type="url"  /></div><div class="oj-field"><label class="oj-label" for="input-email">Email</label><input class="oj-input" id="input-email" type="email"  /></div></div>`,
  'Native input types retain browser keyboard and validation behavior.',
);
export const Validation = story(
  `<div class="oj-stack"><div class="oj-field"><label class="oj-label" for="input-error">Project name</label><input class="oj-input" id="input-error" aria-invalid="true" aria-describedby="input-error-help" value="" required /><p class="oj-helper oj-helper-error" id="input-error-help">Project name is required.</p></div><div class="oj-field"><label class="oj-label" for="input-readonly">Output folder</label><input class="oj-input oj-mono" id="input-readonly" value="/Users/example/exports" readonly /></div><div class="oj-field"><label class="oj-label" for="input-disabled">Unavailable setting</label><input class="oj-input" id="input-disabled" value="Managed by policy" disabled /></div></div>`,
  'Errors include text and aria-describedby. Readonly remains selectable; disabled is unavailable.',
);
export const InputGroup = story(
  `<div class="oj-field"><label class="oj-label" for="width">Image width</label><div class="oj-input-group"><input class="oj-input" id="width" type="number" value="1600" min="1" /><span class="oj-unit">px</span></div></div>`,
  'Unit text and associated labels explain numeric values.',
);
