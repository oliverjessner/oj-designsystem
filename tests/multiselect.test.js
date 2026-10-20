// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMultiselect, initOJ } from '../src/js/index.js';

const options = [
  { value: 'research', label: 'Research' },
  { value: 'design', label: 'Design' },
  { value: 'archive', label: 'Archive', disabled: true },
  { value: 'cafe', label: 'Café' },
];
const handles = [];
function mount(config = {}) {
  const handle = createMultiselect({ label: 'Topics', options, ...config });
  handles.push(handle);
  document.body.append(handle.node);
  return {
    ...handle,
    trigger: handle.node.querySelector('button'),
    panel: handle.node.querySelector('.oj-multiselect-panel'),
    search: handle.node.querySelector('[type="search"]'),
    reset: handle.node.querySelector('.oj-button'),
    checks: () => [...handle.node.querySelectorAll('[type="checkbox"]')],
  };
}
const key = (element, value) =>
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: value,
      bubbles: true,
      cancelable: true,
    }),
  );
const filter = (search, term) => {
  search.value = term;
  search.dispatchEvent(new Event('input', { bubbles: true }));
};
afterEach(() => {
  handles.splice(0).forEach((handle) => handle.dispose());
  document.body.replaceChildren();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('public multiselect', () => {
  it('uses native labeled controls, canonical initial values and independent instances', () => {
    const first = mount({ value: ['design', 'research', 'design', 'missing'] });
    const second = mount();
    expect(first.value()).toEqual(['research', 'design']);
    expect(first.trigger.textContent).toBe('2 selected');
    expect(second.value()).toEqual([]);
    expect(first.trigger.id).not.toBe(second.trigger.id);
    expect(first.node.querySelector('label').htmlFor).toBe(first.trigger.id);
    expect(first.trigger.getAttribute('aria-controls')).toBe(first.panel.id);
    expect(first.trigger.getAttribute('aria-expanded')).toBe('false');
    expect(first.reset.disabled).toBe(false);
    first.open();
    expect(document.activeElement).toBe(first.search);
    expect(second.panel.hidden).toBe(true);
    initOJ(first.node)(); // Factories own their lifecycle; initOJ does not duplicate it.
    first.checks()[0].click();
    expect(first.value()).toEqual(['design']);
  });

  it('emits bubbling detached snapshots only for real selection changes and resets all filtered values', () => {
    const item = mount();
    const changes = [];
    const parent = document.createElement('section');
    document.body.append(parent);
    parent.append(item.node);
    parent.addEventListener(
      'oj:change',
      (event) => changes.push(event.detail),
      { signal: new AbortController().signal },
    );
    item.open();
    item.checks()[0].click();
    item.checks()[1].click();
    expect(changes.map(({ value }) => value)).toEqual([
      ['research'],
      ['research', 'design'],
    ]);
    expect(changes[1].source).toBe('input');
    changes[1].value.push('missing');
    changes[1].options[0].label = 'Changed';
    expect(item.value()).toEqual(['research', 'design']);
    expect(item.trigger.title).toBe('Research, Design');
    filter(item.search, 'café');
    item.reset.click();
    expect(item.value()).toEqual([]);
    expect(changes.at(-1)).toMatchObject({ value: [], source: 'reset' });
    expect(item.reset.disabled).toBe(true);
    expect(item.trigger.textContent).toBe('Select options');
    expect(document.activeElement).toBe(item.search);
    item.reset.click();
    expect(changes).toHaveLength(3);
  });

  it('filters NFC/case/whitespace without clearing hidden selections and reports no results', () => {
    const item = mount({ value: ['design'] });
    item.open();
    filter(item.search, '  CAFE\u0301  ');
    expect(
      item
        .checks()
        .filter((input) => !input.parentElement.hidden)
        .map((input) => input.value),
    ).toEqual(['cafe']);
    expect(item.value()).toEqual(['design']);
    filter(item.search, 'unavailable query');
    expect(item.node.querySelector('[role="status"]').hidden).toBe(false);
    expect(item.node.querySelector('[role="status"]').textContent).toBe(
      'No options found.',
    );
    filter(item.search, '');
    expect(item.node.querySelector('[role="status"]').hidden).toBe(true);
  });

  it('supports keyboard navigation, disabled/hidden skipping, Enter selection and Escape focus return', () => {
    const item = mount();
    key(item.trigger, 'ArrowDown');
    expect(document.activeElement).toBe(item.search);
    key(item.search, 'ArrowUp');
    expect(document.activeElement).toBe(item.checks()[3]);
    key(document.activeElement, 'ArrowUp');
    expect(document.activeElement).toBe(item.checks()[1]);
    key(document.activeElement, 'Home');
    expect(document.activeElement).toBe(item.checks()[0]);
    key(document.activeElement, 'End');
    expect(document.activeElement).toBe(item.checks()[3]);
    key(document.activeElement, 'Enter');
    expect(item.value()).toEqual(['cafe']);
    expect(item.panel.hidden).toBe(false);
    key(document.activeElement, 'Escape');
    expect(document.activeElement).toBe(item.trigger);
    expect(item.panel.hidden).toBe(true);
    key(item.trigger, 'ArrowUp');
    expect(document.activeElement).toBe(item.checks()[3]);
    filter(item.search, 'design');
    item.search.focus();
    key(item.search, 'ArrowDown');
    expect(document.activeElement).toBe(item.checks()[1]);
  });

  it('closes on outside pointer and focus departure without stealing focus', async () => {
    const item = mount();
    const outside = document.createElement('input');
    document.body.append(outside);
    item.open();
    outside.focus();
    await Promise.resolve();
    expect(item.panel.hidden).toBe(true);
    expect(document.activeElement).toBe(outside);
    item.open();
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(item.panel.hidden).toBe(true);
  });

  it('provides atomic option replacement, silent setters and explicit change notifications', () => {
    const item = mount({ value: ['research', 'design'] });
    const change = vi.fn();
    item.node.addEventListener('oj:change', change);
    item.setValue(['cafe', 'unknown', 'cafe']);
    expect(item.value()).toEqual(['cafe']);
    expect(change).not.toHaveBeenCalled();
    item.setValue(['design', 'research'], { emit: true });
    expect(change).toHaveBeenCalledTimes(1);
    expect(change.mock.calls[0][0].detail.source).toBe('api');
    item.setValue(['research', 'design', 'unknown'], { emit: true });
    expect(change).toHaveBeenCalledTimes(1);
    item.open();
    item.checks()[0].focus();
    item.setOptions(
      [
        { value: 'design', label: 'Updated design' },
        { value: 'new', label: 'New option' },
      ],
      { emit: true },
    );
    expect(item.value()).toEqual(['design']);
    expect(item.trigger.textContent).toBe('Updated design');
    expect(document.activeElement).toBe(item.search);
    expect(change.mock.calls.at(-1)[0].detail.source).toBe('options');
    expect(() =>
      item.setOptions([
        { value: 'x', label: 'One' },
        { value: 'x', label: 'Two' },
      ]),
    ).toThrow(TypeError);
    expect(item.value()).toEqual(['design']);
    expect(item.checks()).toHaveLength(2);
    item.setOptions([{ value: 'design', label: 'Renamed' }], { emit: true });
    expect(change).toHaveBeenCalledTimes(2); // Label-only changes do not change values.
    item.setOptions([]);
    expect(item.value()).toEqual([]);
    expect(item.search.disabled).toBe(true);
    expect(item.reset.disabled).toBe(true);
  });

  it('renders all external text literally, including localized summaries', () => {
    const text = '<img src=x onerror=alert(1)>';
    const item = mount({
      label: text,
      description: text,
      options: [{ value: text, label: text }],
      value: [text],
      labels: { search: text, reset: text },
      formatSelection: () => text,
    });
    expect(item.trigger.textContent).toBe(text);
    expect(item.trigger.title).toBe(text);
    expect(item.node.querySelector('img')).toBeNull();
    expect(item.checks()[0].value).toBe(text);
  });

  it('handles empty and disabled controls without opening disabled components', () => {
    const empty = mount({
      options: [],
      labels: { empty: 'Nothing available' },
    });
    empty.open();
    expect(document.activeElement).toBe(empty.panel);
    expect(empty.search.disabled && empty.reset.disabled).toBe(true);
    expect(empty.node.querySelector('[role="status"]').textContent).toBe(
      'Nothing available',
    );
    const disabled = mount({ disabled: true, value: ['research'] });
    disabled.open();
    expect(disabled.panel.hidden).toBe(true);
    expect(disabled.node.querySelector('fieldset').disabled).toBe(true);
    expect(disabled.value()).toEqual(['research']);
  });

  it('keeps native form values and form reset synchronized without submitting from its controls', async () => {
    const item = mount({ name: 'topics', value: ['design'] });
    const form = document.createElement('form');
    document.body.append(form);
    form.append(item.node);
    const submit = vi.fn((event) => event.preventDefault());
    form.addEventListener('submit', submit);
    item.open();
    item.checks()[0].click();
    expect(new FormData(form).getAll('topics')).toEqual(['research', 'design']);
    form.reset();
    await Promise.resolve();
    expect(item.value()).toEqual(['design']);
    expect(item.trigger.textContent).toBe('Design');
    item.setValue(['research']);
    form.addEventListener('reset', (event) => event.preventDefault(), {
      once: true,
    });
    form.reset();
    await Promise.resolve();
    expect(item.value()).toEqual(['research']);
    expect(submit).not.toHaveBeenCalled();
  });

  it('removes global and viewport listeners on idempotent disposal and cancels deferred focus work', async () => {
    const viewport = new EventTarget();
    Object.assign(viewport, {
      offsetLeft: 50,
      offsetTop: 40,
      width: 260,
      height: 360,
    });
    vi.stubGlobal('visualViewport', viewport);
    const remove = vi.spyOn(viewport, 'removeEventListener');
    const item = mount();
    item.open();
    const box = { left: 290, top: 200, bottom: 235, width: 100 };
    vi.spyOn(item.trigger, 'getBoundingClientRect').mockReturnValue(box);
    viewport.dispatchEvent(new Event('resize'));
    expect(item.panel.style.width).toBe('244px');
    expect(item.panel.style.left).toBe('58px');
    item.search.blur();
    item.dispose();
    item.dispose();
    await Promise.resolve();
    expect(remove).toHaveBeenCalledTimes(2);
    expect(item.panel.hidden).toBe(true);
    item.open();
    item.setValue(['research'], { emit: true });
    expect(item.value()).toEqual([]);
    item.trigger.click();
    expect(item.panel.hidden).toBe(true);
  });

  it('works in alternate documents and isolated shadow roots', () => {
    const host = document.createElement('section');
    document.body.append(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const item = mount();
    shadow.append(item.node);
    item.open();
    expect(shadow.activeElement).toBe(item.search);
    key(item.search, 'ArrowDown');
    expect(shadow.activeElement).toBe(item.checks()[0]);
    item.close();
    expect(shadow.activeElement).toBe(item.trigger);
  });
});
