import { cleanupAll } from './internal.js';
import { initTabs } from './tabs.js';
import { initDialogs } from './dialog.js';
import { initDropdowns } from './dropdown.js';
import { initTooltips } from './tooltip.js';

/** Explicit, scoped progressive enhancement. No observer or global app state. */
export function initOJ(root) {
  return cleanupAll([
    initTabs(root),
    initDropdowns(root),
    initTooltips(root),
    initDialogs(root),
  ]);
}
