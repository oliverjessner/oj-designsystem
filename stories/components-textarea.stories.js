import { story } from './helpers.js';

export default { title: 'Components/Textarea' };
export const Editable = story(
  `<div class="oj-field"><label class="oj-label" for="notes">Notes</label><textarea class="oj-textarea" id="notes" rows="4" aria-describedby="notes-help">Keep originals until the export is verified.</textarea><p class="oj-helper" id="notes-help">Describe the workflow for your team.</p></div>`,
  'Native multiline text field; vertical resizing is preserved.',
);
export const Invalid = story(
  `<div class="oj-field"><label class="oj-label" for="description">Description</label><textarea class="oj-textarea" id="description" rows="3" aria-invalid="true" aria-describedby="description-error"></textarea><p class="oj-helper oj-helper-error" id="description-error">Add a description before continuing.</p></div>`,
  'A visible error is linked to the field.',
);
