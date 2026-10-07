import { story, icon } from './helpers.js';

export default { title: 'Components/Dropzone' };
export const Ready = story(
  `<div class="oj-dropzone"><span class="oj-empty-state-icon">${icon('arrow-up-from-bracket')}</span><p><strong>Add images to the batch</strong></p><p class="oj-muted">Drag files here or choose files from your device.</p><label class="oj-button oj-button-secondary" for="dropzone-files">Choose files</label><input class="oj-input" id="dropzone-files" type="file" multiple accept="image/*" /></div>`,
  'Visual dropzone only. A real file input supplies the accessible fallback; file handling belongs to the consumer.',
);
export const States = story(
  `<div class="oj-grid"><div class="oj-dropzone" data-oj-state="drag-active"><strong>Drop files to add them</strong><p class="oj-muted">Drag-active presentation</p></div><div class="oj-dropzone" aria-disabled="true"><strong>Import unavailable</strong><p class="oj-muted">Wait for the current export.</p></div><div class="oj-dropzone" data-oj-state="loading" aria-busy="true"><span class="oj-spinner" aria-hidden="true"></span><p>Inspecting 24 images</p></div></div>`,
  'State attributes style drag activity, disabled and busy states. The consumer controls the operation.',
);
