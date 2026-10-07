import { story, icon } from './helpers.js';

export default { title: 'Components/Button' };
export const Variants = story(
  `<div class="oj-cluster"><button class="oj-button oj-button-primary" >Save</button><button class="oj-button oj-button-secondary" >Cancel</button><button class="oj-button oj-button-ghost" >Details</button><button class="oj-button oj-button-danger" >Delete</button></div>`,
  'Semantics describe intent. Accent controls primary only; destructive actions retain danger colors.',
);
export const States = story(
  `<div class="oj-cluster"><button class="oj-button oj-button-secondary oj-button-compact">Compact</button><button class="oj-button oj-button-primary" disabled>Disabled</button><button class="oj-button oj-button-primary" aria-busy="true" disabled><span class="oj-spinner" aria-hidden="true"></span> Saving</button></div>`,
  'Disabled uses the native attribute. A busy button retains a meaningful text label.',
);
export const WithIcons = story(
  `<div class="oj-cluster"><button class="oj-button oj-button-primary" >${icon('download')} Export</button><button class="oj-button oj-button-secondary" >${icon('folder-open')} Open folder</button></div>`,
  'Decorative icons are hidden from assistive technology; the button text supplies the accessible name.',
);
