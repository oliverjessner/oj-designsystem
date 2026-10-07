// @vitest-environment jsdom
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  closeDialog,
  confirmDialog,
  initDialogs,
  initDropdowns,
  initOJ,
  initTabs,
  initTooltips,
  openDialog,
  toast,
} from '../src/js/index.js';

const cleanups = [];
const owned = (cleanup) => {
  cleanups.push(cleanup);
  return cleanup;
};
const key = (element, name) => {
  const event = new KeyboardEvent('keydown', {
    key: name,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
  return event;
};
const hover = (element, type) => element.dispatchEvent(new MouseEvent(type));
const mount = (html) => {
  const container = document.createElement('section');
  container.innerHTML = html;
  document.body.append(container);
  return container;
};
const tabMarkup = (orientation = '') => `
  <div class="oj-tabs" data-oj-tabs>
    <div role="tablist" aria-label="Project" ${orientation}>
      <button role="tab" aria-selected="true">Overview</button>
      <button role="tab" disabled>Unavailable</button>
      <button role="tab">Settings</button>
      <button role="tab" aria-disabled="true">Archived</button>
    </div>
    <section role="tabpanel">Overview content</section>
    <section role="tabpanel">Unavailable content</section>
    <section role="tabpanel">Settings content</section>
    <section role="tabpanel">Archived content</section>
  </div>`;
const menuMarkup = `
  <div class="oj-dropdown" data-oj-dropdown>
    <button data-oj-dropdown-trigger>Actions</button>
    <div role="menu" data-oj-dropdown-menu hidden>
      <button role="menuitem" data-oj-value="export">Export</button>
      <button role="menuitem" disabled>Unavailable</button>
      <button role="menuitem" data-oj-value="rename">Rename</button>
      <button role="menuitem" aria-disabled="true">Archived</button>
    </div>
  </div>`;

// jsdom does not implement native dialog methods. Model native close/cancel
// events here; real focus trapping and Escape are also exercised in the browser.
const dialogDescriptors = {};
beforeAll(() => {
  for (const name of ['showModal', 'close']) {
    dialogDescriptors[name] = Object.getOwnPropertyDescriptor(
      HTMLDialogElement.prototype,
      name,
    );
  }
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value() {
        this.open = true;
      },
    },
    close: {
      configurable: true,
      value(value = '') {
        if (!this.open) return;
        this.returnValue = value;
        this.open = false;
        this.dispatchEvent(new Event('close'));
      },
    },
  });
});
afterAll(() => {
  for (const name of ['showModal', 'close']) {
    if (dialogDescriptors[name]) {
      Object.defineProperty(
        HTMLDialogElement.prototype,
        name,
        dialogDescriptors[name],
      );
    } else delete HTMLDialogElement.prototype[name];
  }
});
afterEach(() => {
  vi.unstubAllGlobals();
  while (cleanups.length) cleanups.pop()();
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('public initialization', () => {
  it('imports and returns harmless cleanups without browser globals', async () => {
    vi.resetModules();
    vi.stubGlobal('document', undefined);
    vi.stubGlobal('window', undefined);
    const runtime = await import('../src/js/index.js');
    expect(() => runtime.initOJ()()).not.toThrow();
    expect(() => runtime.initTabs()()).not.toThrow();
    expect(() => runtime.initDropdowns()()).not.toThrow();
    expect(() => runtime.initTooltips()()).not.toThrow();
    expect(() => runtime.initDialogs()()).not.toThrow();
  });

  it('scopes enhancement to the requested root and includes the root itself', () => {
    const inside = mount(tabMarkup());
    const outside = mount(tabMarkup());
    owned(initOJ(inside.firstElementChild));
    expect(inside.querySelectorAll('[hidden]')).toHaveLength(3);
    expect(outside.querySelectorAll('[hidden]')).toHaveLength(0);
  });

  it('does not duplicate listeners, and repeated init cleanup preserves the first owner', () => {
    const root = mount(tabMarkup());
    owned(initOJ(root));
    const repeat = initOJ(root);
    repeat();
    const listener = vi.fn();
    root.addEventListener('oj:change', listener);
    root.querySelectorAll('[role="tab"]')[2].click();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('restores progressive content, removes generated IDs, and allows reinitialization', () => {
    const root = mount(tabMarkup());
    const cleanup = owned(initOJ(root));
    cleanup();
    cleanup();
    expect(root.querySelectorAll('[hidden]')).toHaveLength(0);
    expect(root.querySelector('[role="tab"]').hasAttribute('id')).toBe(false);
    owned(initOJ(root));
    root.querySelectorAll('[role="tab"]')[2].click();
    expect(root.querySelectorAll('[role="tabpanel"]')[2].hidden).toBe(false);
  });

  it('handles dynamic components in later init calls without reclaiming existing ones', () => {
    const root = mount(tabMarkup());
    owned(initOJ(root));
    root.insertAdjacentHTML('beforeend', menuMarkup);
    const second = owned(initOJ(root));
    second();
    root.querySelectorAll('[role="tab"]')[2].click();
    expect(root.querySelectorAll('[role="tabpanel"]')[2].hidden).toBe(false);
    expect(
      root
        .querySelector('[data-oj-dropdown-trigger]')
        .hasAttribute('aria-expanded'),
    ).toBe(false);
  });

  it('keeps nested tab widgets independent', () => {
    const root = mount(tabMarkup());
    root
      .querySelector('[role="tabpanel"]')
      .insertAdjacentHTML('beforeend', tabMarkup());
    owned(initTabs(root));
    const widgets = root.querySelectorAll('[data-oj-tabs]');
    const nestedTabs = widgets[1].querySelectorAll('[role="tab"]');
    nestedTabs[2].click();
    expect(nestedTabs[2].getAttribute('aria-selected')).toBe('true');
    expect(
      widgets[0].querySelector('[role="tab"]').getAttribute('aria-selected'),
    ).toBe('true');
  });
});

describe('accessible tabs', () => {
  it('provides keyboard access to text-only panels and preserves authored tabindex on cleanup', () => {
    const root = mount(tabMarkup());
    const panels = root.querySelectorAll('[role="tabpanel"]');
    panels[2].tabIndex = -1;
    const cleanup = owned(initTabs(root));
    expect(panels[0].tabIndex).toBe(0);
    expect(panels[2].tabIndex).toBe(-1);
    panels[0].focus();
    expect(document.activeElement).toBe(panels[0]);
    cleanup();
    expect(panels[0].hasAttribute('tabindex')).toBe(false);
    expect(panels[2].tabIndex).toBe(-1);
  });

  it('creates unique bidirectional ARIA associations and a single tab stop', () => {
    const root = mount(tabMarkup() + tabMarkup());
    owned(initTabs(root));
    const ids = [...root.querySelectorAll('[id]')].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const tab of root.querySelectorAll('[role="tab"]')) {
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
    }
    expect(root.querySelectorAll('[role="tab"][tabindex="0"]')).toHaveLength(2);
  });

  it('activates on click and emits useful change detail once', () => {
    const root = mount(tabMarkup());
    const events = vi.fn();
    root.addEventListener('oj:change', events);
    owned(initTabs(root));
    expect(events).not.toHaveBeenCalled();
    const tab = root.querySelectorAll('[role="tab"]')[2];
    const panel = root.querySelectorAll('[role="tabpanel"]')[2];
    tab.click();
    tab.click();
    expect(panel.hidden).toBe(false);
    expect(document.activeElement).toBe(tab);
    expect(events).toHaveBeenCalledTimes(1);
    expect(events.mock.calls[0][0].detail).toEqual({ tab, panel, index: 2 });
  });

  it('supports arrows, wrapping, Home and End while skipping disabled tabs', () => {
    const root = mount(tabMarkup());
    owned(initTabs(root));
    const tabs = root.querySelectorAll('[role="tab"]');
    tabs[0].focus();
    expect(key(tabs[0], 'ArrowRight').defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(tabs[2]);
    key(tabs[2], 'ArrowRight');
    expect(document.activeElement).toBe(tabs[0]);
    key(tabs[0], 'End');
    expect(document.activeElement).toBe(tabs[2]);
    key(tabs[2], 'Home');
    expect(document.activeElement).toBe(tabs[0]);
    key(tabs[0], 'ArrowLeft');
    expect(document.activeElement).toBe(tabs[2]);
  });

  it('uses Up/Down for vertical tablists and leaves perpendicular arrows alone', () => {
    const root = mount(tabMarkup('aria-orientation="vertical"'));
    owned(initTabs(root));
    const tabs = root.querySelectorAll('[role="tab"]');
    tabs[0].focus();
    expect(key(tabs[0], 'ArrowRight').defaultPrevented).toBe(false);
    key(tabs[0], 'ArrowDown');
    expect(document.activeElement).toBe(tabs[2]);
    key(tabs[2], 'ArrowUp');
    expect(document.activeElement).toBe(tabs[0]);
  });

  it('respects right-to-left horizontal navigation', () => {
    const root = mount(tabMarkup());
    root.querySelector('[role="tablist"]').style.direction = 'rtl';
    owned(initTabs(root));
    const tabs = root.querySelectorAll('[role="tab"]');
    tabs[0].focus();
    key(tabs[0], 'ArrowLeft');
    expect(document.activeElement).toBe(tabs[2]);
  });

  it('ignores aria-disabled click activation and selects the first enabled tab initially', () => {
    const root = mount(tabMarkup());
    root.querySelector('[role="tab"]').setAttribute('aria-disabled', 'true');
    owned(initTabs(root));
    const tabs = root.querySelectorAll('[role="tab"]');
    tabs[3].click();
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].tabIndex).toBe(-1);
  });

  it('honors authored panel IDs and associations even when panel order differs', () => {
    const root = mount(`
      <div data-oj-tabs><div role="tablist">
        <button id="tab-a" role="tab" aria-controls="panel-a">A</button>
        <button id="tab-b" role="tab" aria-controls="panel-b">B</button>
      </div><div role="tabpanel" id="panel-b">B</div>
      <div role="tabpanel" id="panel-a">A</div></div>`);
    owned(initTabs(root));
    expect(document.getElementById('panel-a').hidden).toBe(false);
    expect(document.getElementById('panel-b').hidden).toBe(true);
  });
});

describe('dropdown menus', () => {
  it('clamps open menus to viewport edges and restores authored positioning during cleanup', () => {
    const root = mount(menuMarkup);
    const trigger = root.querySelector('[data-oj-dropdown-trigger]');
    const menu = root.querySelector('[data-oj-dropdown-menu]');
    menu.setAttribute('style', 'color: red;');
    const cleanup = owned(initDropdowns(root));
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      top: 740,
      bottom: 760,
      left: 1000,
      width: 40,
      height: 20,
    });
    vi.spyOn(menu, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 160,
    });
    trigger.click();
    expect(menu.getAttribute('data-oj-placement')).toBe('top');
    expect(Number.parseFloat(menu.style.left)).toBeLessThanOrEqual(
      window.innerWidth - 208,
    );
    expect(Number.parseFloat(menu.style.top)).toBeGreaterThanOrEqual(8);
    expect(menu.style.position).toBe('fixed');
    cleanup();
    expect(menu.getAttribute('style')).toBe('color: red;');
    expect(menu.hasAttribute('data-oj-placement')).toBe(false);
  });

  it('opens on click, supplies ARIA state, focuses the first item, and emits events', () => {
    const root = mount(menuMarkup);
    owned(initDropdowns(root));
    const trigger = root.querySelector('[data-oj-dropdown-trigger]');
    const menu = root.querySelector('[role="menu"]');
    const events = vi.fn();
    root.addEventListener('oj:open', events);
    trigger.click();
    expect(menu.hidden).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement.textContent).toBe('Export');
    expect(events.mock.calls[0][0].detail).toEqual({ trigger, menu });
    trigger.click();
    expect(menu.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('supports keyboard opening, navigation, Home/End, disabled skipping and Escape', () => {
    const root = mount(menuMarkup);
    owned(initDropdowns(root));
    const trigger = root.querySelector('[data-oj-dropdown-trigger]');
    const items = root.querySelectorAll('[role="menuitem"]');
    key(trigger, 'ArrowUp');
    expect(document.activeElement).toBe(items[2]);
    key(items[2], 'ArrowDown');
    expect(document.activeElement).toBe(items[0]);
    key(items[0], 'End');
    expect(document.activeElement).toBe(items[2]);
    key(items[2], 'Home');
    expect(document.activeElement).toBe(items[0]);
    key(items[0], 'Escape');
    expect(root.querySelector('[role="menu"]').hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
    key(trigger, 'Enter');
    expect(root.querySelector('[role="menu"]').hidden).toBe(false);
  });

  it('closes on outside clicks and Tab without trapping keyboard focus', () => {
    const root = mount(menuMarkup);
    owned(initDropdowns(root));
    const trigger = root.querySelector('[data-oj-dropdown-trigger]');
    const menu = root.querySelector('[role="menu"]');
    trigger.click();
    document.body.click();
    expect(menu.hidden).toBe(true);
    trigger.click();
    expect(key(document.activeElement, 'Tab').defaultPrevented).toBe(false);
    expect(menu.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('matches typed item labels and selects them with Enter or Space', () => {
    const root = mount(menuMarkup);
    owned(initDropdowns(root));
    const trigger = root.querySelector('[data-oj-dropdown-trigger]');
    const item = root.querySelector('[data-oj-value="rename"]');
    const listener = vi.fn();
    root.addEventListener('oj:select', listener);
    trigger.click();
    key(document.activeElement, 'r');
    expect(document.activeElement).toBe(item);
    key(item, 'Enter');
    expect(listener.mock.calls[0][0].detail.value).toBe('rename');
    trigger.click();
    key(document.activeElement, ' ');
    expect(listener.mock.calls[1][0].detail.value).toBe('export');
  });

  it('emits selection detail and closes while restoring focus', () => {
    const root = mount(menuMarkup);
    owned(initDropdowns(root));
    const trigger = root.querySelector('[data-oj-dropdown-trigger]');
    const item = root.querySelector('[data-oj-value="export"]');
    const events = vi.fn();
    root.addEventListener('oj:select', events);
    trigger.click();
    item.click();
    expect(events.mock.calls[0][0].detail).toEqual({ item, value: 'export' });
    expect(root.querySelector('[role="menu"]').hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('allows selection cancellation to keep a menu open', () => {
    const root = mount(menuMarkup);
    owned(initDropdowns(root));
    root.addEventListener('oj:select', (event) => event.preventDefault());
    root.querySelector('[data-oj-dropdown-trigger]').click();
    root.querySelector('[role="menuitem"]').click();
    expect(root.querySelector('[role="menu"]').hidden).toBe(false);
  });

  it('prevents native link navigation for aria-disabled menu actions', () => {
    const root = mount(menuMarkup);
    const anchor = document.createElement('a');
    anchor.href = '#unavailable-action';
    anchor.textContent = 'Unavailable link';
    anchor.setAttribute('role', 'menuitem');
    anchor.setAttribute('aria-disabled', 'true');
    root.querySelector('[data-oj-dropdown-menu]').append(anchor);
    owned(initDropdowns(root));
    const listener = vi.fn();
    root.addEventListener('oj:select', listener);
    root.querySelector('[data-oj-dropdown-trigger]').click();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    anchor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(listener).not.toHaveBeenCalled();
    expect(root.querySelector('[role="menu"]').hidden).toBe(false);
  });

  it('ignores disabled items and cleans up listeners for reinitialization', () => {
    const root = mount(menuMarkup);
    const cleanup = owned(initDropdowns(root));
    const events = vi.fn();
    root.addEventListener('oj:select', events);
    root.querySelector('[data-oj-dropdown-trigger]').click();
    root.querySelector('[aria-disabled="true"]').click();
    expect(events).not.toHaveBeenCalled();
    cleanup();
    expect(
      root
        .querySelector('[data-oj-dropdown-trigger]')
        .hasAttribute('aria-expanded'),
    ).toBe(false);
    owned(initDropdowns(root));
    root.querySelector('[data-oj-dropdown-trigger]').click();
    root.querySelector('[role="menuitem"]').click();
    expect(events).toHaveBeenCalledTimes(1);
  });

  it('supports empty menus without throwing during keyboard navigation', () => {
    const root = mount(
      '<div data-oj-dropdown><button data-oj-dropdown-trigger>Open</button><div data-oj-dropdown-menu></div></div>',
    );
    owned(initDropdowns(root));
    key(root.querySelector('button'), 'ArrowDown');
    expect(() =>
      key(root.querySelector('[role="menu"]'), 'ArrowDown'),
    ).not.toThrow();
    expect(document.activeElement).toBe(root.querySelector('[role="menu"]'));
  });
});

describe('tooltips', () => {
  it('adds a preserved accessible description and opens on focus', () => {
    const root = mount(
      '<p id="hint">Existing hint</p><button data-oj-tooltip="Settings" aria-describedby="hint">Settings</button>',
    );
    const cleanup = owned(initTooltips(root));
    const trigger = root.querySelector('button');
    const tooltip = document.querySelector('.oj-tooltip');
    expect(tooltip.hidden).toBe(true);
    expect(trigger.getAttribute('aria-describedby')).toBe(`hint ${tooltip.id}`);
    trigger.focus();
    expect(tooltip.hidden).toBe(false);
    expect(tooltip.getAttribute('role')).toBe('tooltip');
    key(trigger, 'Escape');
    expect(tooltip.hidden).toBe(true);
    cleanup();
    expect(trigger.getAttribute('aria-describedby')).toBe('hint');
    expect(document.querySelector('.oj-tooltip')).toBeNull();
  });

  it('remains hoverable across the trigger-to-tooltip gap and hides after leaving both', () => {
    vi.useFakeTimers();
    const root = mount('<button data-oj-tooltip="Settings">Settings</button>');
    owned(initTooltips(root));
    const trigger = root.querySelector('button');
    const tooltip = document.querySelector('.oj-tooltip');
    hover(trigger, 'mouseenter');
    hover(trigger, 'mouseleave');
    vi.advanceTimersByTime(50);
    hover(tooltip, 'mouseenter');
    vi.advanceTimersByTime(200);
    expect(tooltip.hidden).toBe(false);
    hover(tooltip, 'mouseleave');
    vi.advanceTimersByTime(100);
    expect(tooltip.hidden).toBe(true);
  });

  it('hides after blur, safely handles HTML-like text, and does not duplicate tooltips', () => {
    vi.useFakeTimers();
    const root = mount(
      '<button data-oj-tooltip="">Settings</button><input aria-label="Other">',
    );
    const trigger = root.querySelector('button');
    trigger.setAttribute('data-oj-tooltip', '<img src=x onerror=alert(1)>');
    owned(initTooltips(root));
    initTooltips(root)();
    expect(document.querySelectorAll('.oj-tooltip')).toHaveLength(1);
    trigger.focus();
    const tooltip = document.querySelector('.oj-tooltip');
    expect(tooltip.textContent).toBe('<img src=x onerror=alert(1)>');
    expect(tooltip.querySelector('img')).toBeNull();
    root.querySelector('input').focus();
    vi.advanceTimersByTime(100);
    expect(tooltip.hidden).toBe(true);
  });

  it('clamps positioning to the viewport and falls below a trigger near the top', () => {
    const root = mount('<button data-oj-tooltip="Settings">Settings</button>');
    owned(initTooltips(root));
    const trigger = root.querySelector('button');
    const tooltip = document.querySelector('.oj-tooltip');
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 20,
      left: 1000,
      width: 40,
      height: 20,
    });
    vi.spyOn(tooltip, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 30,
    });
    trigger.focus();
    expect(tooltip.getAttribute('data-oj-placement')).toBe('bottom');
    expect(Number.parseFloat(tooltip.style.left)).toBeLessThanOrEqual(
      window.innerWidth - 208,
    );
    expect(Number.parseFloat(tooltip.style.top)).toBeGreaterThanOrEqual(8);
    expect(tooltip.style.position).toBe('fixed');
  });

  it('mounts inside the native dialog top layer when its trigger is in a modal', () => {
    const root = mount(
      '<dialog><button data-oj-tooltip="Settings">Settings</button></dialog>',
    );
    owned(initTooltips(root));
    const dialog = root.querySelector('dialog');
    const tooltip = dialog.querySelector('.oj-tooltip');
    expect(tooltip).not.toBeNull();
    expect(tooltip.parentElement).toBe(dialog);
  });
});

describe('native dialog helpers', () => {
  it('opens a declarative dialog, focuses autofocus, and restores its opener on close', () => {
    const root = mount(
      '<button data-oj-dialog-open="project-dialog">Open</button><dialog id="project-dialog" data-oj-dialog><input autofocus aria-label="Name"><button data-oj-dialog-close="saved">Save</button></dialog>',
    );
    owned(initDialogs(root));
    const trigger = root.querySelector('button');
    const dialog = root.querySelector('dialog');
    const opened = vi.fn();
    const closed = vi.fn();
    root.addEventListener('oj:open', opened);
    root.addEventListener('oj:close', closed);
    trigger.focus();
    trigger.click();
    expect(dialog.open).toBe(true);
    expect(document.activeElement).toBe(dialog.querySelector('input'));
    dialog.querySelector('button').click();
    expect(dialog.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
    expect(opened).toHaveBeenCalledTimes(1);
    expect(closed.mock.calls[0][0].detail).toEqual({
      dialog,
      returnValue: 'saved',
    });
  });

  it('provides direct ID/element helpers and emits a single event on repeat opening', () => {
    const root = mount(
      '<button>Open</button><dialog id="details"><button>Close</button></dialog>',
    );
    const opener = root.querySelector('button');
    const dialog = root.querySelector('dialog');
    const events = vi.fn();
    dialog.addEventListener('oj:open', events);
    opener.focus();
    expect(openDialog('details', { root })).toBe(dialog);
    openDialog(dialog);
    expect(events).toHaveBeenCalledTimes(1);
    expect(closeDialog(dialog, 'done')).toBe(dialog);
    expect(dialog.returnValue).toBe('done');
    expect(document.activeElement).toBe(opener);
  });

  it('does not cancel native Escape events and restores focus after native close', () => {
    const root = mount(
      '<button>Open</button><dialog><button>Cancel</button></dialog>',
    );
    const opener = root.querySelector('button');
    const dialog = root.querySelector('dialog');
    opener.focus();
    openDialog(dialog);
    const cancel = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancel);
    expect(cancel.defaultPrevented).toBe(false);
    dialog.close();
    expect(document.activeElement).toBe(opener);
  });

  it('keeps ID resolution scoped and rejects invalid dialog targets', () => {
    const inside = mount('<button>Inside</button>');
    mount('<dialog id="outside"></dialog>');
    expect(() => openDialog('outside', { root: inside })).toThrow(TypeError);
    expect(() => openDialog(inside)).toThrow(TypeError);
    expect(() => openDialog('missing')).toThrow(TypeError);
  });

  it('resolves dialog IDs inside a scoped shadow root', () => {
    const host = mount('');
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML =
      '<dialog id="shadow-details"><button>Close</button></dialog>';
    const dialog = shadow.querySelector('dialog');
    expect(openDialog('shadow-details', { root: shadow })).toBe(dialog);
    expect(dialog.open).toBe(true);
    closeDialog('shadow-details', '', { root: shadow });
    expect(dialog.open).toBe(false);
  });

  it('cleans declarative listeners and allows a fresh init', () => {
    const root = mount(
      '<button data-oj-dialog-open="fresh">Open</button><dialog data-oj-dialog id="fresh"><button data-oj-dialog-close>Close</button></dialog>',
    );
    const cleanup = owned(initDialogs(root));
    initDialogs(root)();
    root.querySelector('button').click();
    cleanup();
    expect(root.querySelector('dialog').open).toBe(false);
    expect(root.querySelector('button').hasAttribute('aria-haspopup')).toBe(
      false,
    );
    owned(initDialogs(root));
    root.querySelector('button').click();
    expect(root.querySelector('dialog').open).toBe(true);
  });

  it('confirms with safe text, a dangerous action variant, and an accessible default cancel', async () => {
    const root = mount('<button>Delete project</button>');
    const opener = root.querySelector('button');
    opener.focus();
    const result = confirmDialog({
      title: '<img src=x>',
      message: '<script>alert(1)</script>',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      variant: 'danger',
      root,
    });
    const dialog = root.querySelector('dialog');
    expect(dialog.querySelector('img, script')).toBeNull();
    expect(dialog.querySelector('.oj-dialog-title').textContent).toBe(
      '<img src=x>',
    );
    expect(document.activeElement.textContent).toBe('Keep');
    const confirm = dialog.querySelector('[data-oj-dialog-close="confirm"]');
    expect(confirm.classList.contains('oj-button-danger')).toBe(true);
    confirm.click();
    await expect(result).resolves.toBe(true);
    expect(document.activeElement).toBe(opener);
    expect(root.querySelector('dialog')).toBeNull();
  });

  it('resolves false on cancellation and on native Escape close', async () => {
    const result = confirmDialog();
    const dialog = document.querySelector('dialog');
    dialog.querySelector('[data-oj-dialog-close="cancel"]').click();
    await expect(result).resolves.toBe(false);
    const escaped = confirmDialog();
    document.querySelector('dialog').close();
    await expect(escaped).resolves.toBe(false);
    expect(document.querySelector('dialog')).toBeNull();
  });
});

describe('toast notifications', () => {
  it('renders user content as text and supplies type, live region and dismiss semantics', () => {
    const notification = toast('<img src=x onerror=alert(1)>', {
      type: 'error',
      duration: 0,
    });
    owned(notification.dismiss);
    expect(notification.element.querySelector('img')).toBeNull();
    expect(
      notification.element.querySelector('.oj-toast-message').textContent,
    ).toBe('<img src=x onerror=alert(1)>');
    expect(notification.element.getAttribute('aria-live')).toBe('assertive');
    expect(notification.element.getAttribute('role')).toBe('alert');
    expect(notification.element.classList.contains('oj-toast-error')).toBe(
      true,
    );
    expect(
      notification.element.querySelector('button').getAttribute('aria-label'),
    ).toBe('Dismiss notification');
  });

  it('stacks messages in one region and removes that region after the final dismissal', () => {
    const first = toast('One', { duration: 0, type: 'success' });
    const second = toast('Two', { duration: 0 });
    owned(first.dismiss);
    owned(second.dismiss);
    expect(document.querySelectorAll('.oj-toast-region')).toHaveLength(1);
    expect(document.querySelectorAll('.oj-toast')).toHaveLength(2);
    first.dismiss();
    first.dismiss();
    expect(document.querySelectorAll('.oj-toast')).toHaveLength(1);
    second.element.querySelector('button').click();
    expect(document.querySelector('.oj-toast-region')).toBeNull();
  });

  it('auto-dismisses after the configured time and emits a close event', () => {
    vi.useFakeTimers();
    const notification = toast('Saved', { duration: 1000 });
    owned(notification.dismiss);
    const listener = vi.fn();
    notification.element.addEventListener('oj:close', listener);
    vi.advanceTimersByTime(999);
    expect(notification.element.isConnected).toBe(true);
    vi.advanceTimersByTime(1);
    expect(notification.element.isConnected).toBe(false);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail.type).toBe('info');
  });

  it('pauses timeout while hovered or focused and resumes only after both leave', () => {
    vi.useFakeTimers();
    const notification = toast('Saved', { duration: 1000 });
    owned(notification.dismiss);
    hover(notification.element, 'mouseenter');
    notification.element.querySelector('button').focus();
    vi.advanceTimersByTime(2000);
    expect(notification.element.isConnected).toBe(true);
    hover(notification.element, 'mouseleave');
    vi.advanceTimersByTime(2000);
    expect(notification.element.isConnected).toBe(true);
    notification.element.querySelector('button').blur();
    vi.advanceTimersByTime(1000);
    expect(notification.element.isConnected).toBe(false);
  });

  it('resumes with the remaining display time instead of resetting the timeout', () => {
    vi.useFakeTimers();
    const notification = toast('Saved', { duration: 1000 });
    owned(notification.dismiss);
    vi.advanceTimersByTime(400);
    hover(notification.element, 'mouseenter');
    vi.advanceTimersByTime(5000);
    hover(notification.element, 'mouseleave');
    vi.advanceTimersByTime(599);
    expect(notification.element.isConnected).toBe(true);
    vi.advanceTimersByTime(1);
    expect(notification.element.isConnected).toBe(false);
  });

  it('keeps duration-zero toasts, supports root scoping and recreates a dismissed region', () => {
    vi.useFakeTimers();
    const root = mount('');
    const first = toast('Persistent', { duration: 0, root, type: 'warning' });
    vi.advanceTimersByTime(60000);
    expect(root.querySelector('.oj-toast')).toBe(first.element);
    first.dismiss();
    const second = toast('New', { duration: 0, root });
    owned(second.dismiss);
    expect(root.querySelectorAll('.oj-toast-region')).toHaveLength(1);
    expect(second.element.getAttribute('aria-live')).toBe('polite');
  });

  it('falls back to an info toast for unknown types without interpolating class names', () => {
    const notification = toast('Safe', { type: 'custom unsafe', duration: 0 });
    owned(notification.dismiss);
    expect(notification.element.classList.contains('oj-toast-info')).toBe(true);
    expect(notification.element.getAttribute('data-oj-kind')).toBe('info');
  });
});
