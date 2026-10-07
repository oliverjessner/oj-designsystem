// Internal DOM helpers. Importing the runtime never requires a browser global.
export const resolveRoot = (root) => root ?? globalThis.document;
export const ownerDocument = (root) =>
  root?.nodeType === 9 ? root : root?.ownerDocument;

export function find(root, selector) {
  if (!root?.querySelectorAll) return [];
  return [
    ...(root.matches?.(selector) ? [root] : []),
    ...root.querySelectorAll(selector),
  ];
}

let sequence = 0;
export function uniqueId(document, prefix) {
  let id;
  do {
    id = `oj-${prefix}-${++sequence}`;
  } while (document.getElementById(id));
  return id;
}

export function emit(element, name, detail, cancelable = false) {
  const Event = element.ownerDocument.defaultView.CustomEvent;
  return element.dispatchEvent(
    new Event(name, { bubbles: true, cancelable, detail }),
  );
}

export function rememberAttributes(element, names) {
  const original = names.map((name) => [name, element.getAttribute(name)]);
  return () => {
    for (const [name, value] of original) {
      if (value === null) element.removeAttribute(name);
      else element.setAttribute(name, value);
    }
  };
}

export function listen(target, type, listener, cleanup, options) {
  target.addEventListener(type, listener, options);
  cleanup.push(() => target.removeEventListener(type, listener, options));
}

export function cleanupAll(callbacks) {
  let active = true;
  return () => {
    if (!active) return;
    active = false;
    for (const callback of callbacks.slice().reverse()) callback();
  };
}

// Each call owns only components it initializes. Repeated calls do not acquire
// another owner's listeners or destroy them when their own cleanup runs.
export function initialize(root, selector, registry, setup) {
  const callbacks = [];
  for (const element of find(resolveRoot(root), selector)) {
    if (registry.has(element)) continue;
    const destroy = setup(element);
    if (!destroy) continue;
    registry.set(element, destroy);
    callbacks.push(() => {
      if (registry.get(element) !== destroy) return;
      registry.delete(element);
      destroy();
    });
  }
  return cleanupAll(callbacks);
}

export function disabled(element) {
  return element.disabled || element.getAttribute('aria-disabled') === 'true';
}

export function safeFocus(element) {
  if (element?.isConnected && typeof element.focus === 'function') {
    element.focus({ preventScroll: true });
  }
}
