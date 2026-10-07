import {
  cleanupAll,
  emit,
  initialize,
  listen,
  rememberAttributes,
  uniqueId,
} from './internal.js';

const instances = new WeakMap();

function setup(trigger) {
  const document = trigger.ownerDocument;
  const window = document.defaultView;
  if (!document.body) return null;
  const tooltip = document.createElement('div');
  tooltip.className = 'oj-tooltip';
  tooltip.id = uniqueId(document, 'tooltip');
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  tooltip.style.position = 'fixed';
  tooltip.textContent = trigger.getAttribute('data-oj-tooltip');
  // A tooltip in a modal must remain in that dialog's top layer. Mounting it
  // on body would make it inert and place it underneath the native backdrop.
  const tree = trigger.getRootNode();
  const container =
    trigger.closest('dialog') ?? (tree.nodeType === 11 ? tree : document.body);
  container.append(tooltip);
  const cleanup = [
    rememberAttributes(trigger, ['aria-describedby']),
    () => tooltip.remove(),
  ];
  const description = trigger.getAttribute('aria-describedby');
  trigger.setAttribute(
    'aria-describedby',
    [description, tooltip.id].filter(Boolean).join(' '),
  );
  let overTrigger = false;
  let overTooltip = false;
  let focused = false;
  let timer;

  function position() {
    if (tooltip.hidden) return;
    const padding = 8;
    const gap = 6;
    const width = window.innerWidth;
    const height = window.innerHeight;
    tooltip.style.maxWidth = `${Math.max(0, width - padding * 2)}px`;
    const anchor = trigger.getBoundingClientRect();
    const box = tooltip.getBoundingClientRect();
    const topFits = anchor.top >= box.height + padding + gap;
    const y = topFits ? anchor.top - box.height - gap : anchor.bottom + gap;
    const x = anchor.left + (anchor.width - box.width) / 2;
    tooltip.style.left = `${Math.max(padding, Math.min(x, width - box.width - padding))}px`;
    tooltip.style.top = `${Math.max(padding, Math.min(y, height - box.height - padding))}px`;
    tooltip.setAttribute('data-oj-placement', topFits ? 'top' : 'bottom');
  }

  function show() {
    window.clearTimeout(timer);
    tooltip.textContent = trigger.getAttribute('data-oj-tooltip');
    if (!tooltip.textContent) return;
    const changed = tooltip.hidden;
    tooltip.hidden = false;
    position();
    if (changed) emit(trigger, 'oj:open', { trigger, tooltip });
  }

  function hide() {
    window.clearTimeout(timer);
    if (tooltip.hidden) return;
    tooltip.hidden = true;
    emit(trigger, 'oj:close', { trigger, tooltip });
  }

  function scheduleHide() {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (!overTrigger && !overTooltip && !focused) hide();
    }, 100);
  }

  listen(
    trigger,
    'mouseenter',
    () => {
      overTrigger = true;
      show();
    },
    cleanup,
  );
  listen(
    trigger,
    'mouseleave',
    () => {
      overTrigger = false;
      scheduleHide();
    },
    cleanup,
  );
  listen(
    tooltip,
    'mouseenter',
    () => {
      overTooltip = true;
      show();
    },
    cleanup,
  );
  listen(
    tooltip,
    'mouseleave',
    () => {
      overTooltip = false;
      scheduleHide();
    },
    cleanup,
  );
  listen(
    trigger,
    'focusin',
    () => {
      focused = true;
      show();
    },
    cleanup,
  );
  listen(
    trigger,
    'focusout',
    () => {
      focused = false;
      scheduleHide();
    },
    cleanup,
  );
  listen(
    document,
    'keydown',
    (event) => {
      if (event.key === 'Escape') hide();
    },
    cleanup,
  );
  listen(window, 'resize', position, cleanup);
  listen(window, 'scroll', position, cleanup, true);
  cleanup.push(() => window.clearTimeout(timer));
  return cleanupAll(cleanup);
}

/** Enhance text-only tooltips. Essential content must remain in the page. */
export function initTooltips(root) {
  return initialize(root, '[data-oj-tooltip]', instances, setup);
}
