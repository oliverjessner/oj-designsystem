import { story } from './helpers.js';

export default { title: 'Patterns/Settings' };

export const Preferences = story(
  `<section class="oj-panel oj-demo-form oj-stack"><header class="oj-section-header"><div><p class="oj-kicker">Workspace</p><h2 class="oj-heading-3">Export preferences</h2></div></header><div class="oj-field"><label class="oj-label" for="settings-format">Default format</label><select class="oj-select" id="settings-format"><option>WebP</option><option>PNG</option></select><p class="oj-helper">Applies to new batches.</p></div><div class="oj-field"><label class="oj-label" for="settings-folder">Output folder</label><input class="oj-input oj-mono" id="settings-folder" value="/Users/example/exports" readonly /></div><label class="oj-switch"><input type="checkbox" role="switch" checked /><span class="oj-switch-track" aria-hidden="true"></span><span>Preserve source metadata</span></label><div class="oj-cluster"><button class="oj-button oj-button-primary">Save preferences</button><button class="oj-button oj-button-ghost">Reset</button></div></section>`,
  'A panel, labeled controls and checkbox switch form a settings section. Persistence is consumer logic.',
);
