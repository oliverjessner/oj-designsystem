// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initCountUps, initOJ } from '../src/js/index.js';

let observers;
let frames;
let motion;
let nextFrame;
const cleanups = [];
const owned = (cleanup) => {
  cleanups.push(cleanup);
  return cleanup;
};
const mount = (target = '1000', text = '1.000', attributes = {}) => {
  const element = document.createElement('span');
  element.setAttribute('data-oj-count-up', target);
  element.setAttribute('data-oj-count-locale', 'de-DE');
  for (const [name, value] of Object.entries(attributes))
    element.setAttribute(name, value);
  element.textContent = text;
  document.body.append(element);
  return element;
};
const tick = (time) => {
  const callbacks = [...frames.values()];
  frames.clear();
  callbacks.forEach((callback) => callback(time));
};

beforeEach(() => {
  observers = [];
  frames = new Map();
  nextFrame = 0;
  motion = new EventTarget();
  motion.matches = false;
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => motion),
  );
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback) {
        this.callback = callback;
        this.observe = vi.fn();
        this.disconnect = vi.fn();
        observers.push(this);
      }
      intersect(ratio = 1) {
        this.callback([
          { isIntersecting: ratio > 0, intersectionRatio: ratio },
        ]);
      }
    },
  );
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((id) => frames.delete(id)),
  );
  vi.spyOn(window.performance, 'now').mockReturnValue(0);
});

afterEach(() => {
  while (cleanups.length) cleanups.pop()();
  document.body.replaceChildren();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('public count-up animation', () => {
  it('waits for sufficient visibility, preserves the accessible final value and animates only once', () => {
    const element = mount();
    owned(initCountUps(element));
    expect(element.textContent).toBe('1.000');
    observers[0].intersect(0.5);
    expect(element.getAttribute('data-oj-count-state')).toBe('pending');
    expect(frames.size).toBe(0);
    observers[0].intersect();
    expect(element.querySelector('.oj-sr-only').textContent).toBe('1.000');
    expect(
      element.querySelector('.oj-count-up-current').getAttribute('aria-hidden'),
    ).toBe('true');
    expect(
      element.querySelector('.oj-count-up-reserve').getAttribute('aria-hidden'),
    ).toBe('true');
    expect(element.querySelector('[aria-live], [tabindex]')).toBeNull();
    tick(600);
    const value = Number(
      element
        .querySelector('.oj-count-up-current')
        .textContent.replaceAll('.', ''),
    );
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(1000);
    tick(1800);
    expect(element.textContent).toBe('1.000');
    expect(element.getAttribute('data-oj-count-state')).toBe('complete');
    observers[0].intersect();
    owned(initCountUps(element));
    expect(observers).toHaveLength(1);
    expect(frames.size).toBe(0);
  });

  it('uses configured delay, duration, decimals, prefix and suffix', () => {
    const element = mount('12.5', '€12,50h', {
      'data-oj-count-decimals': '2',
      'data-oj-count-prefix': '€',
      'data-oj-count-suffix': 'h',
      'data-oj-count-duration': '1000',
      'data-oj-count-delay': '200',
    });
    owned(initCountUps(element));
    observers[0].intersect();
    tick(100);
    expect(element.querySelector('.oj-count-up-current').textContent).toBe(
      '€0,00h',
    );
    tick(600);
    expect(element.querySelector('.oj-count-up-current').textContent).toMatch(
      /^€\d+,\d{2}h$/,
    );
    expect(element.getAttribute('data-oj-count-state')).toBe('running');
    tick(1199);
    expect(element.getAttribute('data-oj-count-state')).toBe('running');
    tick(1200);
    expect(element.textContent).toBe('€12,50h');
  });

  it('supports negative targets and zero without parsing localized text', () => {
    const negative = mount('-12.5', '-12,5');
    const zero = mount('0', '0');
    owned(initCountUps(document.body));
    observers.forEach((observer) => observer.intersect());
    tick(600);
    expect(negative.querySelector('.oj-count-up-current').textContent).toMatch(
      /^-\d+,\d$/,
    );
    expect(zero.querySelector('.oj-count-up-current').textContent).toBe('0');
    tick(1800);
    expect(negative.textContent).toBe('-12,5');
    expect(zero.textContent).toBe('0');
  });

  it('uses the nearest language and defaults invalid timing values', () => {
    const root = document.createElement('div');
    root.lang = 'en-US';
    document.body.append(root);
    const element = mount('30000', '30,000', {
      'data-oj-count-duration': '-1',
      'data-oj-count-delay': 'invalid',
    });
    element.removeAttribute('data-oj-count-locale');
    root.append(element);
    owned(initCountUps(root));
    observers[0].intersect();
    tick(600);
    expect(element.querySelector('.oj-count-up-current').textContent).toMatch(
      /^\d{1,3},\d{3}$/,
    );
    tick(1800);
    expect(element.textContent).toBe('30,000');
  });

  it('keeps arbitrary text literal in every animation layer and restores the exact original node', () => {
    const text = '<img src=x onerror=alert(1)>1000';
    const element = mount('1000', text, {
      'data-oj-count-prefix': '<img src=x>',
    });
    const original = element.firstChild;
    owned(initCountUps(element));
    observers[0].intersect();
    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('.oj-sr-only').textContent).toBe(text);
    expect(element.querySelector('.oj-count-up-current').textContent).toBe(
      '<img src=x>0',
    );
    tick(1800);
    expect(element.firstChild).toBe(original);
    expect(element.textContent).toBe(text);
  });

  it('retains invalid or structured content without creating animation state', () => {
    const invalid = [
      '',
      '1.000h',
      '1,000',
      'Infinity',
      'NaN',
      '9007199254740992',
    ].map((target) => mount(target));
    invalid.push(
      mount('1000', '1.000', { 'data-oj-count-locale': 'not_a_locale' }),
    );
    invalid.push(mount('1000', '1.000', { 'data-oj-count-decimals': '21' }));
    invalid.push(mount('1000', '1.000', { 'data-oj-count-decimals': '1.5' }));
    const structured = mount();
    structured.replaceChildren(document.createElement('strong'));
    structured.firstChild.textContent = '1.000';
    invalid.push(structured);
    owned(initCountUps(document.body));
    expect(observers).toHaveLength(0);
    invalid.forEach((element) => {
      expect(element.textContent).toBe('1.000');
      expect(element.hasAttribute('data-oj-count-state')).toBe(false);
    });
    expect(structured.firstChild.tagName).toBe('STRONG');
  });

  it('keeps final HTML when reduced motion or required browser APIs prevent enhancement', () => {
    const element = mount();
    motion.matches = true;
    owned(initCountUps(element));
    motion.matches = false;
    vi.stubGlobal('IntersectionObserver', undefined);
    owned(initCountUps(element));
    expect(element.textContent).toBe('1.000');
    expect(element.hasAttribute('data-oj-count-state')).toBe(false);
    expect(observers).toHaveLength(0);
  });

  it('finishes pending and running values immediately when reduced motion is enabled', () => {
    const running = mount();
    const pending = mount('2000', '2.000');
    owned(initCountUps(document.body));
    observers[0].intersect();
    expect(frames.size).toBe(1);
    motion.matches = true;
    motion.dispatchEvent(new Event('change'));
    expect(frames.size).toBe(0);
    expect(running.textContent).toBe('1.000');
    expect(pending.textContent).toBe('2.000');
    expect(running.getAttribute('data-oj-count-state')).toBe('complete');
    expect(pending.getAttribute('data-oj-count-state')).toBe('complete');
    motion.matches = false;
    motion.dispatchEvent(new Event('change'));
    observers.forEach((observer) => observer.intersect());
    expect(frames.size).toBe(0);
  });

  it('owns cleanup once, restores text/classes/state and permits a fresh animation', () => {
    const element = mount('1000', '1.000', {
      'data-oj-count-state': 'authored',
    });
    element.className = 'oj-text';
    const cleanup = owned(initCountUps(element));
    initCountUps(element)();
    expect(element.getAttribute('data-oj-count-state')).toBe('pending');
    observers[0].intersect();
    const lateFrame = [...frames.values()][0];
    cleanup();
    cleanup();
    lateFrame(600);
    expect(element.textContent).toBe('1.000');
    expect(element.className).toBe('oj-text');
    expect(element.getAttribute('data-oj-count-state')).toBe('authored');
    expect(frames.size).toBe(0);
    owned(initCountUps(element));
    expect(observers).toHaveLength(2);
    observers[1].intersect();
    expect(element.getAttribute('data-oj-count-state')).toBe('running');
  });

  it('discovers new scoped and shadow-root values through initOJ without reclaiming previous ownership', () => {
    const host = document.createElement('section');
    document.body.append(host);
    const root = host.attachShadow({ mode: 'open' });
    const first = mount();
    const outside = mount('3000', '3.000');
    root.append(first);
    owned(initOJ(root));
    const second = mount('2000', '2.000');
    root.append(second);
    const later = owned(initCountUps(root));
    later();
    expect(first.getAttribute('data-oj-count-state')).toBe('pending');
    expect(second.hasAttribute('data-oj-count-state')).toBe(false);
    expect(outside.hasAttribute('data-oj-count-state')).toBe(false);
    expect(observers).toHaveLength(2);
  });

  it('stops scheduling frames when an animating element is detached', () => {
    const element = mount();
    owned(initCountUps(element));
    observers[0].intersect();
    element.remove();
    tick(600);
    expect(frames.size).toBe(0);
    expect(element.textContent).toBe('1.000');
  });
});
