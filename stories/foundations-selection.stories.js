import { createMultiselect } from 'oj-designsystem';
import { story, icon } from './helpers.js';

export default { title: 'Foundations/Selection' };

export const ControlsAndContent = story(
  `<div class="oj-stack">
    <section class="oj-stack" aria-labelledby="selection-controls-title">
      <h2 class="oj-heading-2" id="selection-controls-title">Control labels</h2>
      <p class="oj-text">Drag across an action or choice label. Its text stays unselected. Buttons, choices and disclosures still work with the keyboard.</p>
      <div class="oj-cluster">
        <button type="button" class="oj-button oj-button-primary">Export files</button>
        <button type="button" class="oj-icon-button" aria-label="Export settings" data-oj-tooltip="Choose a destination for the exported files.">${icon('sliders')}</button>
        <button type="button" class="oj-button" disabled>Unavailable action</button>
        <button type="button" class="oj-tag" aria-pressed="true">Selected filter</button>
        <a class="oj-tag" href="#selection-content-title">Content destination</a>
      </div>
      <label class="oj-check">
        <input class="oj-checkbox" type="checkbox" aria-describedby="selection-check-help" />
        <span>Preserve metadata <span class="oj-helper" id="selection-check-help">This supporting description can be selected and copied.</span></span>
      </label>
      <label class="oj-switch">
        <input type="checkbox" role="switch" aria-describedby="selection-switch-help" />
        <span class="oj-switch-track" aria-hidden="true"></span>
        <span>Watch output folder <span class="oj-helper" id="selection-switch-help">Folder changes are inspected locally.</span></span>
      </label>
      <fieldset class="oj-field">
        <legend class="oj-label">Metadata mode</legend>
        <label class="oj-check"><input class="oj-radio" type="radio" name="selection-metadata" value="original" checked /> Preserve original values</label>
        <label class="oj-check"><input class="oj-radio" type="radio" name="selection-metadata" value="minimal" /> Keep minimal metadata</label>
      </fieldset>
      <fieldset class="oj-field">
        <legend class="oj-label">Output format</legend>
        <div class="oj-segmented">
          <label><input type="radio" name="selection-format" value="webp" checked /><span>WebP</span></label>
          <label><input type="radio" name="selection-format" value="png" /><span>PNG</span></label>
        </div>
      </fieldset>
      <div class="oj-dropdown" data-oj-dropdown>
        <button type="button" class="oj-button" data-oj-dropdown-trigger>File actions ${icon('chevron-down')}</button>
        <div class="oj-menu" data-oj-dropdown-menu role="menu" hidden>
          <button type="button" class="oj-menu-item" role="menuitem">Export selected</button>
          <button type="button" class="oj-menu-item" role="menuitem" disabled>Archive selected</button>
        </div>
      </div>
      <div id="selection-multiselect"></div>
      <nav class="oj-nav" aria-label="Selection example navigation">
        <a class="oj-nav-link" href="#selection-content-title">Copyable content</a>
        <a class="oj-nav-link" href="#selection-table">Table data</a>
        <span class="oj-badge">Reference</span>
      </nav>
      <nav class="oj-breadcrumb" aria-label="Selection example breadcrumb">
        <ol><li><a href="#selection-controls-title">Controls</a></li><li><span aria-current="page">Selection policy</span></li></ol>
      </nav>
      <nav class="oj-pagination" aria-label="Selection example pages">
        <button type="button" class="oj-button oj-button-ghost" aria-current="page" aria-label="Page 1">1</button>
        <button type="button" class="oj-button oj-button-ghost" aria-label="Page 2">2</button>
        <span class="oj-helper">Page context remains selectable.</span>
      </nav>
      <ul class="oj-list oj-list-interactive">
        <li><button type="button" class="oj-list-item">Open export settings</button></li>
      </ul>
      <div class="oj-cluster"><span class="oj-tag">Local metadata</span><p class="oj-helper">Copyable metadata sits outside native action buttons and links.</p></div>
    </section>
    <section class="oj-stack" aria-labelledby="selection-content-title">
      <h2 class="oj-heading-2" id="selection-content-title">Copyable information</h2>
      <p class="oj-text">Select this paragraph, its heading or this <a class="oj-link" href="#selection-table">ordinary content link</a>. Information remains available for copying.</p>
      <div class="oj-cluster"><span class="oj-tag">Static taxonomy</span><span class="oj-badge oj-badge-success">Ready to export</span><a class="oj-tag">Tag without a destination</a></div>
      <div class="oj-field">
        <label class="oj-label" for="selection-editable">Editable output name</label>
        <input class="oj-input" id="selection-editable" value="research-export" />
      </div>
      <div class="oj-field">
        <label class="oj-label" for="selection-readonly">Readonly output path</label>
        <input class="oj-input" id="selection-readonly" value="/exports/research-export.webp" readonly />
      </div>
      <div class="oj-field">
        <label class="oj-label" for="selection-log">Readonly export log</label>
        <textarea class="oj-textarea" id="selection-log" readonly>Export completed. Original metadata preserved.</textarea>
      </div>
      <p class="oj-helper oj-helper-error">Validation example: choose an output folder before exporting.</p>
      <div class="oj-alert oj-alert-info">Informational messages remain selectable and copyable.</div>
      <div class="oj-table-container" id="selection-table">
        <table class="oj-table">
          <caption>The sort action and the table data have different selection behavior.</caption>
          <thead><tr><th scope="col" aria-sort="ascending"><button type="button" class="oj-table-sort">File ${icon('arrow-up')}</button></th><th scope="col">Size</th></tr></thead>
          <tbody><tr data-oj-state="selected"><td>research-notes.webp</td><td class="oj-mono">124 KB</td></tr></tbody>
        </table>
      </div>
      <div class="oj-tabs" data-oj-tabs>
        <div class="oj-tab-list" role="tablist" aria-label="Export information">
          <button type="button" class="oj-tab" role="tab" id="selection-overview-tab" aria-controls="selection-overview" aria-selected="true">Overview</button>
          <button type="button" class="oj-tab" role="tab" id="selection-history-tab" aria-controls="selection-history">History</button>
        </div>
        <div class="oj-tab-panel" role="tabpanel" id="selection-overview" aria-labelledby="selection-overview-tab">Tab labels are controls. This panel text remains selectable.</div>
        <div class="oj-tab-panel" role="tabpanel" id="selection-history" aria-labelledby="selection-history-tab">Export history can be selected and copied.</div>
      </div>
      <details class="oj-accordion" open>
        <summary>Selection details</summary>
        <div class="oj-accordion-body"><p>The disclosure is a control. Its expanded content remains copyable.</p></div>
      </details>
      <pre class="oj-code-block"><code>Export completed: research-notes.webp
Metadata preserved: true</code></pre>
    </section>
  </div>`,
  'Compare control labels with informative content using pointer selection. Hover or focus the settings icon to select its tooltip text; use the keyboard to select field values, including readonly text.',
  (root) => {
    const picker = createMultiselect({
      label: 'Topics',
      description: 'The description and search value remain copyable.',
      options: [
        { value: 'research', label: 'Research' },
        { value: 'design', label: 'Design' },
      ],
    });
    root.querySelector('#selection-multiselect').append(picker.node);
    return () => picker.dispose();
  },
);
