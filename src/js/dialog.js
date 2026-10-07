import {
  cleanupAll,
  disabled,
  emit,
  find,
  initialize,
  listen,
  ownerDocument,
  rememberAttributes,
  resolveRoot,
  safeFocus,
  uniqueId,
} from './internal.js';

const states = new WeakMap();
const dialogInstances = new WeakMap();
const triggerInstances = new WeakMap();
const focusable =
  'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

function resolveDialog(target, root) {
  if (typeof target !== 'string') {
    if (target?.localName === 'dialog') return target;
    throw new TypeError('Expected a native <dialog> element or its ID.');
  }
  const scope = resolveRoot(root);
  const id = target.replace(/^#/, '');
  const dialog =
    scope?.nodeType === 9
      ? scope.getElementById(id)
      : find(scope, 'dialog').find((element) => element.id === id);
  if (
    dialog?.localName !== 'dialog' ||
    (scope?.nodeType !== 9 && scope !== dialog && !scope?.contains(dialog))
  )
    throw new TypeError(`Dialog "${target}" was not found in root.`);
  return dialog;
}

function createState(dialog, managed = false) {
  const document = dialog.ownerDocument;
  const cleanup = [];
  const state = {
    opened: dialog.open,
    opener: null,
    destroy: null,
  };
  states.set(dialog, state);

  listen(
    dialog,
    'close',
    () => {
      if (!state.opened) return;
      state.opened = false;
      const opener = state.opener;
      state.opener = null;
      safeFocus(opener);
      emit(dialog, 'oj:close', { dialog, returnValue: dialog.returnValue });
      if (!managed) state.destroy();
    },
    cleanup,
  );
  listen(
    dialog,
    'click',
    (event) => {
      const button = event.target.closest?.('[data-oj-dialog-close]');
      if (!button || button.closest('dialog') !== dialog || disabled(button))
        return;
      event.preventDefault();
      closeDialog(
        dialog,
        button.getAttribute('data-oj-dialog-close') || button.value || '',
      );
    },
    cleanup,
  );
  state.destroy = cleanupAll([
    ...cleanup,
    () => {
      if (dialog.open && typeof dialog.close === 'function') dialog.close();
      safeFocus(state.opener);
      state.opener = null;
      states.delete(dialog);
    },
  ]);
  // Native <dialog> handles the modal focus trap and Escape/cancel behavior.
  // The close listener also covers method="dialog" forms and direct close().
  if (dialog.open && !dialog.contains(document.activeElement)) {
    state.opener = document.activeElement;
  }
  return state;
}

/** Open a native modal dialog, preserving the element that should regain focus. */
export function openDialog(target, options = {}) {
  const dialog = resolveDialog(target, options.root);
  if (dialog.open) return dialog;
  if (typeof dialog.showModal !== 'function') {
    throw new TypeError('This browser does not support native modal dialogs.');
  }
  const state = states.get(dialog) ?? createState(dialog);
  state.opener = options.trigger ?? dialog.ownerDocument.activeElement;
  try {
    dialog.showModal();
  } catch (error) {
    state.opener = null;
    throw error;
  }
  state.opened = true;
  const autofocus = dialog.querySelector('[autofocus]');
  if (autofocus && !disabled(autofocus)) safeFocus(autofocus);
  else if (!dialog.contains(dialog.ownerDocument.activeElement)) {
    safeFocus(dialog.querySelector(focusable) ?? dialog);
  }
  emit(dialog, 'oj:open', { dialog, returnValue: dialog.returnValue });
  return dialog;
}

/** Close a dialog with an optional native returnValue. */
export function closeDialog(target, returnValue = '', options = {}) {
  const dialog = resolveDialog(target, options.root);
  if (dialog.open) dialog.close(String(returnValue));
  return dialog;
}

/** Initialize native dialogs and declarative open buttons inside root. */
export function initDialogs(root) {
  const scope = resolveRoot(root);
  const cleanDialogs = initialize(
    scope,
    'dialog[data-oj-dialog]',
    dialogInstances,
    (dialog) => {
      if (states.has(dialog)) return null;
      return createState(dialog, true).destroy;
    },
  );
  const cleanTriggers = initialize(
    scope,
    '[data-oj-dialog-open]',
    triggerInstances,
    (trigger) => {
      const cleanup = [
        rememberAttributes(trigger, ['aria-haspopup', 'aria-controls']),
      ];
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute(
        'aria-controls',
        trigger.getAttribute('data-oj-dialog-open').replace(/^#/, ''),
      );
      listen(
        trigger,
        'click',
        (event) => {
          if (disabled(trigger)) return;
          event.preventDefault();
          openDialog(trigger.getAttribute('data-oj-dialog-open'), {
            root: scope,
            trigger,
          });
        },
        cleanup,
      );
      return cleanupAll(cleanup);
    },
  );
  return cleanupAll([cleanDialogs, cleanTriggers]);
}

/** Show a text-only confirmation dialog. Resolve false on cancellation/Escape. */
export function confirmDialog(options = {}) {
  const root = resolveRoot(options.root);
  const document = ownerDocument(root);
  const container = root?.nodeType === 9 ? root.body : root;
  if (!document || !container?.append) {
    return Promise.reject(new TypeError('confirmDialog requires a DOM root.'));
  }
  const dialog = document.createElement('dialog');
  dialog.className = 'oj-dialog';
  dialog.setAttribute('data-oj-dialog', '');
  const header = document.createElement('header');
  header.className = 'oj-dialog-header';
  const title = document.createElement('h2');
  title.className = 'oj-dialog-title';
  title.id = uniqueId(document, 'confirm-title');
  title.textContent = String(options.title ?? 'Confirm action');
  header.append(title);
  const body = document.createElement('div');
  body.className = 'oj-dialog-body';
  const message = document.createElement('p');
  message.id = uniqueId(document, 'confirm-message');
  message.textContent = String(options.message ?? 'Do you want to continue?');
  body.append(message);
  const footer = document.createElement('footer');
  footer.className = 'oj-dialog-footer';
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'oj-button oj-button-secondary';
  cancel.textContent = String(options.cancelLabel ?? 'Cancel');
  cancel.setAttribute('data-oj-dialog-close', 'cancel');
  cancel.autofocus = true;
  const confirm = document.createElement('button');
  confirm.type = 'button';
  confirm.className = `oj-button oj-button-${options.variant === 'danger' ? 'danger' : 'primary'}`;
  confirm.textContent = String(options.confirmLabel ?? 'Confirm');
  confirm.setAttribute('data-oj-dialog-close', 'confirm');
  footer.append(cancel, confirm);
  dialog.append(header, body, footer);
  dialog.setAttribute('aria-labelledby', title.id);
  dialog.setAttribute('aria-describedby', message.id);
  container.append(dialog);

  return new Promise((resolve, reject) => {
    const cleanup = initDialogs(dialog);
    dialog.addEventListener(
      'close',
      () => {
        const confirmed = dialog.returnValue === 'confirm';
        cleanup();
        dialog.remove();
        resolve(confirmed);
      },
      { once: true },
    );
    try {
      openDialog(dialog);
    } catch (error) {
      cleanup();
      dialog.remove();
      reject(error);
    }
  });
}
