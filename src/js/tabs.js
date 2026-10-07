import {
  cleanupAll,
  disabled,
  emit,
  initialize,
  listen,
  rememberAttributes,
  safeFocus,
  uniqueId,
} from './internal.js';

const instances = new WeakMap();

function setup(container) {
  const own = (element) => element.closest('[data-oj-tabs]') === container;
  const list = [...container.querySelectorAll('[role="tablist"]')].find(own);
  if (!list) return null;
  const tabs = [...list.querySelectorAll('[role="tab"]')].filter(own);
  const panels = [...container.querySelectorAll('[role="tabpanel"]')].filter(
    own,
  );
  if (!tabs.length || !panels.length) return null;
  const document = container.ownerDocument;
  const cleanup = [];
  const pairs = tabs.map((tab, index) => {
    const controlled = panels.find(
      (panel) => panel.id && panel.id === tab.getAttribute('aria-controls'),
    );
    return {
      tab,
      panel: panels.includes(controlled) ? controlled : panels[index],
    };
  });
  for (const { tab, panel } of pairs) {
    cleanup.push(
      rememberAttributes(tab, [
        'id',
        'aria-controls',
        'aria-selected',
        'tabindex',
      ]),
    );
    tab.id ||= uniqueId(document, 'tab');
    if (panel) {
      cleanup.push(
        rememberAttributes(panel, [
          'id',
          'aria-labelledby',
          'hidden',
          'tabindex',
        ]),
      );
      panel.id ||= uniqueId(document, 'panel');
      if (!panel.hasAttribute('tabindex')) panel.tabIndex = 0;
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('aria-labelledby', tab.id);
    }
  }

  let selected =
    tabs.find(
      (tab) => !disabled(tab) && tab.getAttribute('aria-selected') === 'true',
    ) ?? tabs.find((tab) => !disabled(tab));

  function activate(tab, notify = true, focus = false) {
    if (!tabs.includes(tab) || disabled(tab)) return;
    const changed = selected !== tab;
    selected = tab;
    for (const pair of pairs) {
      const active = pair.tab === tab;
      pair.tab.setAttribute('aria-selected', String(active));
      pair.tab.tabIndex = active ? 0 : -1;
      if (pair.panel) pair.panel.hidden = !active;
    }
    if (focus) safeFocus(tab);
    if (notify && changed) {
      emit(container, 'oj:change', {
        tab,
        panel: pairs.find((pair) => pair.tab === tab)?.panel,
        index: tabs.indexOf(tab),
      });
    }
  }

  if (selected) activate(selected, false);
  else {
    for (const tab of tabs) {
      tab.tabIndex = -1;
      tab.setAttribute('aria-selected', 'false');
    }
  }

  listen(
    list,
    'click',
    (event) => {
      const tab = event.target.closest?.('[role="tab"]');
      if (tabs.includes(tab)) activate(tab, true, true);
    },
    cleanup,
  );
  listen(
    list,
    'keydown',
    (event) => {
      const tab = event.target.closest?.('[role="tab"]');
      if (!tabs.includes(tab) || disabled(tab)) return;
      const available = tabs.filter((candidate) => !disabled(candidate));
      const vertical = list.getAttribute('aria-orientation') === 'vertical';
      const rtl =
        document.defaultView.getComputedStyle(list).direction === 'rtl';
      let next;
      const forward = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
      const backward = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
      if (event.key === 'Home') next = available[0];
      else if (event.key === 'End') next = available.at(-1);
      else if (event.key === forward || event.key === backward) {
        const step = event.key === forward ? 1 : -1;
        next =
          available[
            (available.indexOf(tab) + step + available.length) %
              available.length
          ];
      }
      if (next) {
        event.preventDefault();
        activate(next, true, true);
      }
    },
    cleanup,
  );
  return cleanupAll(cleanup);
}

/** Enhance tabs in root. The returned function destroys only newly owned tabs. */
export function initTabs(root) {
  return initialize(root, '[data-oj-tabs]', instances, setup);
}
