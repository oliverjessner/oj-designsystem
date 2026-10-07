import {
  cleanupAll,
  emit,
  listen,
  ownerDocument,
  resolveRoot,
} from './internal.js';

const regions = new WeakMap();
const kinds = new Set(['info', 'success', 'warning', 'danger', 'error']);

/** Display a text-only toast. duration: 0 keeps it until explicitly dismissed. */
export function toast(message, options = {}) {
  const root = resolveRoot(options.root);
  const document = ownerDocument(root);
  const container = root?.nodeType === 9 ? root.body : root;
  if (!document || !container?.append)
    throw new TypeError('toast requires a DOM root.');
  const window = document.defaultView;
  let region = regions.get(container);
  if (!region?.isConnected) {
    region = document.createElement('div');
    region.className = 'oj-toast-region';
    region.setAttribute('aria-label', 'Notifications');
    region.setAttribute('data-oj-toast-region', '');
    container.append(region);
    regions.set(container, region);
  }
  const type = kinds.has(options.type) ? options.type : 'info';
  const element = document.createElement('div');
  element.className = `oj-toast oj-toast-${type}`;
  element.setAttribute('data-oj-kind', type);
  element.setAttribute(
    'role',
    type === 'error' || type === 'danger' ? 'alert' : 'status',
  );
  element.setAttribute(
    'aria-live',
    type === 'error' || type === 'danger' ? 'assertive' : 'polite',
  );
  element.setAttribute('aria-atomic', 'true');
  const text = document.createElement('span');
  text.className = 'oj-toast-message';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'oj-icon-button oj-toast-dismiss';
  button.setAttribute(
    'aria-label',
    String(options.dismissLabel ?? 'Dismiss notification'),
  );
  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-xmark';
  icon.setAttribute('aria-hidden', 'true');
  button.append(icon);
  element.append(text, button);
  region.append(element);
  // Populate an already-mounted live region so assistive technology can observe
  // the text mutation. All caller-provided content remains plain text.
  text.textContent = String(message);
  const cleanup = [];
  let dismissed = false;
  let timer;
  let started;
  let hovered = false;
  let focused = false;
  let remaining = Number.isFinite(options.duration)
    ? Math.max(0, options.duration)
    : 4000;
  const persistent = remaining === 0;

  function pause() {
    if (timer === undefined) return;
    window.clearTimeout(timer);
    remaining = Math.max(0, remaining - (window.performance.now() - started));
    timer = undefined;
  }

  function resume() {
    if (dismissed || persistent || hovered || focused || timer !== undefined)
      return;
    started = window.performance.now();
    timer = window.setTimeout(dismiss, remaining);
  }

  const removeListeners = cleanupAll(cleanup);
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    window.clearTimeout(timer);
    removeListeners();
    emit(element, 'oj:close', { element, type });
    element.remove();
    if (!region.childElementCount) {
      region.remove();
      if (regions.get(container) === region) regions.delete(container);
    }
  }

  listen(button, 'click', dismiss, cleanup);
  listen(
    element,
    'mouseenter',
    () => {
      hovered = true;
      pause();
    },
    cleanup,
  );
  listen(
    element,
    'mouseleave',
    () => {
      hovered = false;
      resume();
    },
    cleanup,
  );
  listen(
    element,
    'focusin',
    () => {
      focused = true;
      pause();
    },
    cleanup,
  );
  listen(
    element,
    'focusout',
    (event) => {
      if (element.contains(event.relatedTarget)) return;
      focused = false;
      resume();
    },
    cleanup,
  );
  resume();
  emit(element, 'oj:open', { element, type });
  return { element, dismiss };
}
