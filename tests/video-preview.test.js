// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initOJ, initVideoPreviews } from '../src/js/index.js';

let observers;
let motion;
let paused;
let playback;
const cleanups = [];
const owned = (cleanup) => {
  cleanups.push(cleanup);
  return cleanup;
};
const mount = () => {
  const card = document.createElement('article');
  card.setAttribute('data-oj-video-preview', '');
  card.innerHTML =
    '<video class="oj-video-card-media" controls></video><button type="button" data-oj-video-toggle hidden>Original label</button>';
  document.body.append(card);
  return {
    card,
    video: card.querySelector('video'),
    button: card.querySelector('button'),
  };
};
const settle = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

beforeEach(() => {
  observers = [];
  paused = new WeakMap();
  motion = new EventTarget();
  motion.matches = false;
  playback = () => Promise.resolve();
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => motion),
  );
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback) {
        this.callback = callback;
        this.disconnect = vi.fn();
        observers.push(this);
      }
      observe(target) {
        this.target = target;
      }
      intersect(ratio = 1) {
        this.callback([
          {
            target: this.target,
            isIntersecting: ratio > 0,
            intersectionRatio: ratio,
          },
        ]);
      }
    },
  );
  vi.spyOn(HTMLMediaElement.prototype, 'paused', 'get').mockImplementation(
    function () {
      return paused.get(this) !== false;
    },
  );
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function () {
    paused.set(this, false);
    this.dispatchEvent(new Event('play'));
    return playback();
  });
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function () {
    const wasPlaying = paused.get(this) === false;
    paused.set(this, true);
    if (wasPlaying) this.dispatchEvent(new Event('pause'));
  });
});

afterEach(() => {
  while (cleanups.length) cleanups.pop()();
  document.body.replaceChildren();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('public video previews', () => {
  it('previews only visible media, provides a pause control and stops offscreen', async () => {
    const { card, video, button } = mount();
    owned(initVideoPreviews(card));
    expect(button.hidden).toBe(false);
    expect(button.getAttribute('aria-controls')).toBe(video.id);
    expect(video.controls).toBe(true);
    expect(video.muted && video.loop && video.playsInline).toBe(true);
    observers[0].intersect(0.2);
    await settle();
    expect(video.play).not.toHaveBeenCalled();
    observers[0].intersect();
    await settle();
    expect(card.getAttribute('data-oj-video-state')).toBe('playing');
    expect(button.textContent).toBe('Pause preview');
    observers[0].intersect(0);
    expect(video.paused).toBe(true);
    expect(button.textContent).toBe('Play preview');
  });

  it('honors explicit button pause/play and does not restart a manual pause on re-entry', async () => {
    const { card, video, button } = mount();
    owned(initVideoPreviews(card));
    observers[0].intersect();
    await settle();
    button.click();
    expect(video.paused).toBe(true);
    observers[0].intersect(0);
    observers[0].intersect();
    await settle();
    expect(video.play).toHaveBeenCalledTimes(1);
    button.click();
    await settle();
    expect(video.play).toHaveBeenCalledTimes(2);
    expect(video.paused).toBe(false);
  });

  it('honors a pause through native video controls', async () => {
    const { card, video } = mount();
    owned(initVideoPreviews(card));
    observers[0].intersect();
    await settle();
    video.pause();
    observers[0].intersect(0);
    observers[0].intersect();
    await settle();
    expect(video.play).toHaveBeenCalledTimes(1);
    expect(card.getAttribute('data-oj-video-state')).toBe('paused');
  });

  it('suppresses automatic motion, stops on a preference change and permits explicit manual play', async () => {
    const { card, video, button } = mount();
    motion.matches = true;
    owned(initVideoPreviews(card));
    observers[0].intersect();
    await settle();
    expect(video.play).not.toHaveBeenCalled();
    motion.matches = false;
    motion.dispatchEvent(new Event('change'));
    await settle();
    expect(video.paused).toBe(false);
    motion.matches = true;
    motion.dispatchEvent(new Event('change'));
    expect(video.paused).toBe(true);
    button.click();
    await settle();
    expect(video.paused).toBe(false);
  });

  it('pauses when the document becomes hidden', async () => {
    const { card, video } = mount();
    owned(initVideoPreviews(card));
    observers[0].intersect();
    await settle();
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    document.dispatchEvent(new Event('visibilitychange'));
    expect(video.paused).toBe(true);
  });

  it('handles rejected autoplay and leaves a manual retry available', async () => {
    const { card, video, button } = mount();
    playback = () => Promise.reject(new Error('NotAllowedError'));
    owned(initVideoPreviews(card));
    observers[0].intersect();
    await settle();
    expect(card.getAttribute('data-oj-video-state')).toBe('blocked');
    expect(button.textContent).toBe('Play preview');
    observers[0].intersect();
    await settle();
    expect(video.play).toHaveBeenCalledTimes(1);
    playback = () => Promise.resolve();
    button.click();
    await settle();
    expect(card.getAttribute('data-oj-video-state')).toBe('playing');
  });

  it('retains native fallback without observer support or complete preview markup', () => {
    const { card, video, button } = mount();
    vi.stubGlobal('IntersectionObserver', undefined);
    owned(initVideoPreviews(card));
    expect(button.hidden).toBe(true);
    expect(video.controls).toBe(true);
    expect(card.hasAttribute('data-oj-video-state')).toBe(false);
    button.remove();
    expect(() => initVideoPreviews(card)()).not.toThrow();
  });

  it('preserves one cleanup owner and restores original text, IDs, attributes and media settings', async () => {
    const { card, video, button } = mount();
    const originalNode = button.firstChild;
    const cleanup = owned(initVideoPreviews(card));
    initVideoPreviews(card)();
    expect(observers).toHaveLength(1);
    expect(button.hidden).toBe(false);
    observers[0].intersect();
    await settle();
    cleanup();
    cleanup();
    expect(video.paused).toBe(true);
    expect(video.id).toBe('');
    expect(video.muted || video.loop || video.playsInline).toBe(false);
    expect(video.hasAttribute('loop')).toBe(false);
    expect(button.hidden).toBe(true);
    expect(button.firstChild).toBe(originalNode);
    expect(button.hasAttribute('aria-controls')).toBe(false);
    expect(card.hasAttribute('data-oj-video-state')).toBe(false);
    owned(initVideoPreviews(card));
    expect(observers).toHaveLength(2);
  });

  it('cancels a queued playback before cleanup and isolates a fresh owner from a late promise', async () => {
    const { card, video } = mount();
    const cleanup = owned(initVideoPreviews(card));
    observers[0].intersect();
    cleanup();
    await settle();
    expect(video.play).not.toHaveBeenCalled();
    let resolve;
    playback = () =>
      new Promise((done) => {
        resolve = done;
      });
    const second = owned(initVideoPreviews(card));
    observers[1].intersect();
    await settle();
    second();
    owned(initVideoPreviews(card));
    resolve();
    await settle();
    expect(card.getAttribute('data-oj-video-state')).toBe('paused');
    expect(video.paused).toBe(true);
  });

  it('uses literal localized labels and initializes shadow-root markup through initOJ', async () => {
    const { card, button } = mount();
    card.setAttribute('data-oj-video-pause-label', '<img src=x> Pause');
    const host = document.createElement('div');
    document.body.append(host);
    const root = host.attachShadow({ mode: 'open' });
    root.append(card);
    owned(initOJ(root));
    observers[0].intersect();
    await settle();
    expect(button.textContent).toBe('<img src=x> Pause');
    expect(button.querySelector('img')).toBeNull();
  });
});
