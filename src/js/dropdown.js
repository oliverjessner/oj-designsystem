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
const itemSelector =
  '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [data-oj-menu-item]';

function setup(container) {
  const own = (element) => element.closest('[data-oj-dropdown]') === container;
  const trigger = [
    ...container.querySelectorAll('[data-oj-dropdown-trigger]'),
  ].find(own);
  const menu = [...container.querySelectorAll('[data-oj-dropdown-menu]')].find(
    own,
  );
  if (!trigger || !menu) return null;
  const document = container.ownerDocument;
  const cleanup = [
    rememberAttributes(container, ['data-oj-state']),
    rememberAttributes(trigger, [
      'aria-expanded',
      'aria-controls',
      'aria-haspopup',
    ]),
    rememberAttributes(menu, [
      'id',
      'role',
      'hidden',
      'tabindex',
      'style',
      'data-oj-placement',
    ]),
  ];
  const originalItems = [...menu.querySelectorAll(itemSelector)].filter(
    (item) => item.closest('[data-oj-dropdown-menu]') === menu,
  );
  for (const item of originalItems) {
    cleanup.push(rememberAttributes(item, ['tabindex', 'role']));
    if (!item.hasAttribute('role')) item.setAttribute('role', 'menuitem');
    item.tabIndex = -1;
  }
  menu.id ||= uniqueId(document, 'menu');
  menu.setAttribute('role', 'menu');
  menu.tabIndex = -1;
  trigger.setAttribute('aria-controls', menu.id);
  trigger.setAttribute('aria-haspopup', 'menu');
  let opened = false;
  let search = '';
  let searchTimer;

  const items = () =>
    [...menu.querySelectorAll(itemSelector)].filter(
      (item) =>
        !disabled(item) &&
        !item.closest('[hidden]') &&
        item.closest('[data-oj-dropdown-menu]') === menu &&
        document.defaultView.getComputedStyle(item).display !== 'none' &&
        document.defaultView.getComputedStyle(item).visibility !== 'hidden',
    );

  function position() {
    if (!opened) return;
    const window = document.defaultView;
    const padding = 8;
    const gap = 4;
    const maxWidth = Math.max(0, window.innerWidth - padding * 2);
    menu.style.position = 'fixed';
    menu.style.right = 'auto';
    menu.style.bottom = 'auto';
    menu.style.left = '0px';
    menu.style.top = '0px';
    menu.style.maxWidth = `${maxWidth}px`;
    menu.style.maxHeight = `${Math.max(0, window.innerHeight - padding * 2)}px`;
    menu.style.overflowY = 'auto';
    if (menu.getBoundingClientRect().width > maxWidth)
      menu.style.minWidth = '0px';
    const anchor = trigger.getBoundingClientRect();
    const box = menu.getBoundingClientRect();
    const below = Math.max(
      0,
      window.innerHeight - anchor.bottom - gap - padding,
    );
    const above = Math.max(0, anchor.top - gap - padding);
    const onTop = box.height > below && above > below;
    const available = onTop ? above : below;
    menu.style.maxHeight = `${available}px`;
    const height = Math.min(box.height, available);
    const top = onTop ? anchor.top - gap - height : anchor.bottom + gap;
    menu.style.left = `${Math.max(padding, Math.min(anchor.left, window.innerWidth - box.width - padding))}px`;
    menu.style.top = `${Math.max(padding, Math.min(top, window.innerHeight - height - padding))}px`;
    menu.setAttribute('data-oj-placement', onTop ? 'top' : 'bottom');
  }

  function close(restoreFocus = false, notify = true) {
    const changed = opened;
    opened = false;
    search = '';
    document.defaultView.clearTimeout(searchTimer);
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    container.setAttribute('data-oj-state', 'closed');
    if (restoreFocus) safeFocus(trigger);
    if (changed && notify) emit(container, 'oj:close', { trigger, menu });
  }

  function open(last = false) {
    if (disabled(trigger)) return;
    const changed = !opened;
    opened = true;
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    container.setAttribute('data-oj-state', 'open');
    position();
    const available = items();
    safeFocus((last ? available.at(-1) : available[0]) ?? menu);
    if (changed) emit(container, 'oj:open', { trigger, menu });
  }

  close(false, false);
  listen(trigger, 'click', () => (opened ? close(true) : open()), cleanup);
  listen(
    trigger,
    'keydown',
    (event) => {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        open(event.key === 'ArrowUp');
      }
    },
    cleanup,
  );
  listen(
    menu,
    'keydown',
    (event) => {
      if (!opened || event.target.closest?.('[data-oj-dropdown-menu]') !== menu)
        return;
      const available = items();
      const active = menu.getRootNode().activeElement ?? document.activeElement;
      const current = available.indexOf(active);
      let next;
      if (event.key === 'ArrowDown')
        next = available[(current + 1) % available.length];
      if (event.key === 'ArrowUp')
        next = available[(current - 1 + available.length) % available.length];
      if (event.key === 'Home') next = available[0];
      if (event.key === 'End') next = available.at(-1);
      if (event.key === 'Enter' || event.key === ' ') {
        const item = event.target.closest?.(itemSelector);
        if (available.includes(item)) {
          event.preventDefault();
          item.click();
        }
        return;
      }
      if (
        event.key.length === 1 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        const character = event.key.toLocaleLowerCase();
        search = search === character ? character : search + character;
        document.defaultView.clearTimeout(searchTimer);
        searchTimer = document.defaultView.setTimeout(() => {
          search = '';
        }, 500);
        const ordered = [
          ...available.slice(current + 1),
          ...available.slice(0, current + 1),
        ];
        next = ordered.find((item) =>
          item.textContent.trim().toLocaleLowerCase().startsWith(search),
        );
      }
      if (next) {
        event.preventDefault();
        safeFocus(next);
      }
    },
    cleanup,
  );
  listen(
    menu,
    'click',
    (event) => {
      const item = event.target.closest?.(itemSelector);
      if (item?.closest('[data-oj-dropdown-menu]') === menu && disabled(item)) {
        event.preventDefault();
        return;
      }
      if (!opened || !items().includes(item)) return;
      if (
        emit(
          container,
          'oj:select',
          {
            item,
            value:
              item.getAttribute('data-oj-value') ?? item.textContent.trim(),
          },
          true,
        )
      )
        close(true);
    },
    cleanup,
  );
  listen(
    document,
    'keydown',
    (event) => {
      if (!opened) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close(true);
      } else if (event.key === 'Tab') {
        // Preserve a stable keyboard origin before hiding the focused item;
        // the browser can then move forward/backward from the trigger normally.
        close(true);
      }
    },
    cleanup,
  );
  listen(
    document,
    'click',
    (event) => {
      if (opened && !event.composedPath().includes(container)) close();
    },
    cleanup,
  );
  listen(document.defaultView, 'resize', position, cleanup);
  listen(document.defaultView, 'scroll', position, cleanup, true);
  cleanup.push(() => close(false, false));
  cleanup.push(() => document.defaultView.clearTimeout(searchTimer));
  return cleanupAll(cleanup);
}

/** Enhance declarative action menus inside root. */
export function initDropdowns(root) {
  return initialize(root, '[data-oj-dropdown]', instances, setup);
}
