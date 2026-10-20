import { cleanupAll, emit, listen, safeFocus, uniqueId } from './internal.js';

function normalizeOptions(options) {
  const seen = new Set();
  return options.map((option) => {
    if (
      typeof option.value !== 'string' ||
      typeof option.label !== 'string' ||
      seen.has(option.value)
    ) {
      throw new TypeError(
        'Multiselect options need unique string values and string labels.',
      );
    }
    seen.add(option.value);
    return {
      value: option.value,
      label: option.label,
      disabled: !!option.disabled,
    };
  });
}

const searchText = (text) => text.normalize('NFC').toLocaleLowerCase();

/** Create an owned, framework-independent checkbox disclosure. No automatic mount. */
export function createMultiselect(config) {
  if (typeof config.label !== 'string' || !config.label.trim()) {
    throw new TypeError('Multiselect needs a nonempty label.');
  }
  const document = config.document ?? globalThis.document;
  const window = document.defaultView;
  let options = normalizeOptions(config.options ?? []);
  let selected = new Set(config.value ?? []);
  let disposed = false;
  let opened = false;
  let choices = [];
  let focusFrame;
  const cleanup = [];
  const labels = {
    placeholder: 'Select options',
    search: 'Search options',
    searchPlaceholder: 'Find an option',
    reset: 'Reset selection',
    empty: 'No options available.',
    noResults: 'No options found.',
    ...config.labels,
  };
  const prefix = uniqueId(document, 'multiselect');

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  const node = element('div', 'oj-field oj-multiselect');
  node.setAttribute('data-oj-multiselect', '');
  const label = element('label', 'oj-label', config.label);
  label.id = `${prefix}-label`;
  const trigger = element('button', 'oj-select oj-multiselect-trigger');
  trigger.id = `${prefix}-trigger`;
  trigger.type = 'button';
  trigger.disabled = !!config.disabled;
  label.htmlFor = trigger.id;
  const selection = element('span', 'oj-multiselect-value');
  selection.id = `${prefix}-value`;
  selection.setAttribute('aria-live', 'polite');
  selection.setAttribute('aria-atomic', 'true');
  trigger.setAttribute('aria-labelledby', `${label.id} ${selection.id}`);
  const chevron = element(
    'i',
    'oj-multiselect-chevron fa-solid fa-chevron-down',
  );
  chevron.setAttribute('aria-hidden', 'true');
  trigger.append(selection, chevron);

  const panel = element('div', 'oj-multiselect-panel');
  panel.id = `${prefix}-panel`;
  panel.tabIndex = -1;
  panel.hidden = true;
  trigger.setAttribute('aria-controls', panel.id);
  // Top-layer rendering escapes clipping/transforming ancestors while retaining
  // inherited theme tokens. Older engines retain the fixed-position fallback.
  const popover = typeof panel.showPopover === 'function';
  if (popover) panel.setAttribute('popover', 'manual');
  const searchField = element('div', 'oj-field');
  const searchLabel = element('label', 'oj-label', labels.search);
  const search = element('input', 'oj-input');
  search.type = 'search';
  search.id = `${prefix}-search`;
  search.placeholder = labels.searchPlaceholder;
  search.autocomplete = 'off';
  searchLabel.htmlFor = search.id;
  searchField.append(searchLabel, search);
  panel.append(searchField);
  if (config.description) {
    const description = element('p', 'oj-helper', config.description);
    description.id = `${prefix}-description`;
    panel.append(description);
    trigger.setAttribute('aria-describedby', description.id);
  }
  const fieldset = element('fieldset', 'oj-multiselect-options');
  fieldset.disabled = !!config.disabled;
  const legend = element('legend', 'oj-sr-only', config.label);
  const list = element('div', 'oj-multiselect-list');
  fieldset.append(legend, list);
  const status = element('p', 'oj-helper');
  status.setAttribute('role', 'status');
  const reset = element(
    'button',
    'oj-button oj-button-secondary oj-button-compact',
  );
  reset.type = 'button';
  const resetIcon = element('i', 'fa-solid fa-xmark');
  resetIcon.setAttribute('aria-hidden', 'true');
  reset.append(resetIcon, document.createTextNode(labels.reset));
  panel.append(fieldset, status, reset);
  node.append(label, trigger, panel);

  const value = () =>
    options
      .filter((option) => selected.has(option.value))
      .map((option) => option.value);
  const activeElement = () =>
    node.getRootNode().activeElement ?? document.activeElement;
  const enabledChoices = () =>
    choices
      .filter(
        ({ row, input }) =>
          !row.hidden && !input.disabled && !fieldset.disabled,
      )
      .map(({ input }) => input);

  function position() {
    if (!opened || !node.isConnected) return;
    const viewport = window.visualViewport;
    const left = viewport?.offsetLeft ?? 0;
    const top = viewport?.offsetTop ?? 0;
    const width = viewport?.width ?? window.innerWidth;
    const height = viewport?.height ?? window.innerHeight;
    const gap = 8;
    const anchor = trigger.getBoundingClientRect();
    const panelWidth = Math.max(
      0,
      Math.min(Math.max(anchor.width, 288), width - gap * 2),
    );
    panel.style.width = `${panelWidth}px`;
    panel.style.left = `${Math.max(left + gap, Math.min(anchor.left, left + width - panelWidth - gap))}px`;
    panel.style.maxHeight = `${Math.max(1, height - gap * 2)}px`;
    const below = Math.max(0, top + height - anchor.bottom - gap * 2);
    const above = Math.max(0, anchor.top - top - gap * 2);
    const onTop = below < Math.min(panel.scrollHeight, 320) && above > below;
    panel.style.maxHeight = `${Math.max(1, onTop ? above : below)}px`;
    const panelHeight = panel.getBoundingClientRect().height;
    const y = onTop ? anchor.top - gap - panelHeight : anchor.bottom + gap;
    panel.style.top = `${Math.max(top + gap, Math.min(y, top + height - gap - panelHeight))}px`;
    panel.setAttribute('data-oj-placement', onTop ? 'top' : 'bottom');
  }

  function filter() {
    const term = searchText(search.value.trim());
    for (const { row, option } of choices)
      row.hidden = !searchText(option.label).includes(term);
    status.textContent = options.length ? labels.noResults : labels.empty;
    status.hidden =
      options.length > 0 && choices.some(({ row }) => !row.hidden);
    fieldset.hidden = !options.length;
    position();
  }

  function update(previous, notify, source) {
    const selectedOptions = options.filter((option) =>
      selected.has(option.value),
    );
    selected = new Set(selectedOptions.map((option) => option.value));
    selection.textContent = config.formatSelection
      ? config.formatSelection(selectedOptions.map((option) => ({ ...option })))
      : selectedOptions.length === 0
        ? labels.placeholder
        : selectedOptions.length === 1
          ? selectedOptions[0].label
          : `${selectedOptions.length} selected`;
    trigger.title = selectedOptions.map((option) => option.label).join(', ');
    reset.disabled = !!config.disabled || !selected.size;
    search.disabled = !!config.disabled || !options.length;
    for (const { input, option } of choices)
      input.checked = selected.has(option.value);
    position();
    const values = value();
    if (
      notify &&
      (values.length !== previous.length ||
        values.some((item, index) => item !== previous[index]))
    ) {
      emit(node, 'oj:change', {
        value: values,
        options: selectedOptions.map((option) => ({ ...option })),
        source,
      });
    }
  }

  function renderOptions() {
    choices = options.map((option) => {
      const row = element('label', 'oj-check oj-multiselect-option');
      const input = element('input', 'oj-checkbox');
      input.type = 'checkbox';
      input.value = option.value;
      input.checked = selected.has(option.value);
      input.defaultChecked = input.checked;
      input.disabled = option.disabled;
      if (config.name) input.name = config.name;
      row.append(
        input,
        element('span', 'oj-multiselect-option-label', option.label),
      );
      return { row, input, option };
    });
    list.replaceChildren(...choices.map(({ row }) => row));
    filter();
  }

  function close(restoreFocus = false) {
    opened = false;
    if (popover && panel.matches(':popover-open')) panel.hidePopover();
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    node.setAttribute('data-oj-state', 'closed');
    if (restoreFocus) safeFocus(trigger);
  }

  function open(last = false) {
    if (disposed || trigger.disabled || !node.isConnected) return;
    opened = true;
    panel.hidden = false;
    if (popover && !panel.matches(':popover-open')) panel.showPopover();
    trigger.setAttribute('aria-expanded', 'true');
    node.setAttribute('data-oj-state', 'open');
    position();
    safeFocus(
      (last ? enabledChoices().at(-1) : !search.disabled && search) || panel,
    );
  }

  renderOptions();
  update([], false);
  close();
  listen(trigger, 'click', () => (opened ? close(true) : open()), cleanup);
  listen(
    trigger,
    'keydown',
    (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        open(event.key === 'ArrowUp');
      }
    },
    cleanup,
  );
  listen(search, 'input', filter, cleanup);
  listen(
    list,
    'change',
    (event) => {
      const choice = choices.find(({ input }) => input === event.target);
      if (!choice || choice.input.disabled || fieldset.disabled) return;
      const previous = value();
      if (choice.input.checked) selected.add(choice.option.value);
      else selected.delete(choice.option.value);
      update(previous, true, 'input');
    },
    cleanup,
  );
  listen(
    reset,
    'click',
    () => {
      if (reset.disabled) return;
      const previous = value();
      selected.clear();
      // Move focus before disabling the button that was just activated.
      safeFocus(search.disabled ? panel : search);
      update(previous, true, 'reset');
    },
    cleanup,
  );
  listen(
    node,
    'keydown',
    (event) => {
      if (!opened) return;
      if (event.key === 'Tab') {
        window.cancelAnimationFrame(focusFrame);
        focusFrame = window.requestAnimationFrame(() => {
          if (!disposed && opened && !node.contains(activeElement())) close();
        });
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close(true);
        return;
      }
      const available = enabledChoices();
      const current = available.indexOf(event.target);
      if (event.target !== search && current < 0) return;
      if (event.target === search && event.key === 'Enter') {
        event.preventDefault();
        return;
      }
      let next;
      if (event.key === 'ArrowDown')
        next = available[(current + 1) % available.length];
      if (event.key === 'ArrowUp')
        next =
          current < 0
            ? available.at(-1)
            : available[(current - 1 + available.length) % available.length];
      if (current >= 0 && event.key === 'Home') next = available[0];
      if (current >= 0 && event.key === 'End') next = available.at(-1);
      if (current >= 0 && event.key === 'Enter') {
        event.preventDefault();
        event.target.click();
      } else if (next) {
        event.preventDefault();
        safeFocus(next);
      }
    },
    cleanup,
  );
  listen(
    document,
    'focusin',
    (event) => {
      // Native focus can briefly be on body between blur and focus. Observe the
      // completed focus destination, not that intermediate state.
      if (opened && !event.composedPath().includes(node)) close();
    },
    cleanup,
  );
  listen(
    document,
    'pointerdown',
    (event) => {
      if (opened && !event.composedPath().includes(node)) close();
    },
    cleanup,
  );
  listen(
    document,
    'reset',
    (event) => {
      if (!event.target.contains(node)) return;
      const previous = value();
      window.queueMicrotask(() => {
        if (disposed || event.defaultPrevented) return;
        selected = new Set(
          choices
            .filter(({ input }) => input.checked)
            .map(({ option }) => option.value),
        );
        update(previous, true, 'reset');
      });
    },
    cleanup,
  );
  listen(window, 'resize', position, cleanup);
  listen(window, 'scroll', position, cleanup, true);
  if (window.visualViewport) {
    listen(window.visualViewport, 'resize', position, cleanup);
    listen(window.visualViewport, 'scroll', position, cleanup);
  }

  const dispose = cleanupAll([
    ...cleanup,
    () => {
      disposed = true;
      window.cancelAnimationFrame(focusFrame);
      close();
    },
  ]);
  return {
    node,
    value,
    setValue(values, { emit: notify = false } = {}) {
      if (disposed) return;
      const previous = value();
      selected = new Set(values);
      update(previous, notify, 'api');
    },
    setOptions(next, { emit: notify = false } = {}) {
      if (disposed) return;
      const normalized = normalizeOptions(next);
      const previous = value();
      const focusedChoice = choices.find(
        ({ input }) => input === activeElement(),
      );
      options = normalized;
      renderOptions();
      update(previous, notify, 'options');
      if (focusedChoice && opened) {
        safeFocus(
          choices.find(
            ({ option, input, row }) =>
              option.value === focusedChoice.option.value &&
              !input.disabled &&
              !row.hidden,
          )?.input ?? (!search.disabled ? search : panel),
        );
      }
    },
    open: () => open(),
    close: () => close(node.contains(activeElement())),
    dispose,
  };
}
