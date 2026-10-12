import {
  initialize,
  listen,
  cleanupAll,
  rememberAttributes,
  uniqueId,
} from './internal.js';

const instances = new WeakMap();

/** Optional muted viewport previews with a visible, keyboard-accessible pause. */
export function initVideoPreviews(root) {
  return initialize(root, '[data-oj-video-preview]', instances, (card) => {
    const video = card.querySelector('video.oj-video-card-media');
    const button = card.querySelector('button[data-oj-video-toggle]');
    const document = card.ownerDocument;
    const window = document.defaultView;
    if (
      !video ||
      !button ||
      button.disabled ||
      !window?.IntersectionObserver ||
      video.closest('[data-oj-video-preview]') !== card ||
      button.closest('[data-oj-video-preview]') !== card
    )
      return;

    const callbacks = [];
    const originalText = [...button.childNodes];
    const restoreCard = rememberAttributes(card, ['data-oj-video-state']);
    const restoreVideo = rememberAttributes(video, [
      'id',
      'autoplay',
      'loop',
      'playsinline',
    ]);
    const restoreButton = rememberAttributes(button, [
      'hidden',
      'aria-controls',
    ]);
    const original = {
      muted: video.muted,
      loop: video.loop,
      playsInline: video.playsInline,
      autoplay: video.autoplay,
    };
    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const playLabel =
      card.getAttribute('data-oj-video-play-label') || 'Play preview';
    const pauseLabel =
      card.getAttribute('data-oj-video-pause-label') || 'Pause preview';
    let active = true;
    let visible = false;
    let manual = false;
    let desired = false;
    let attempt = 0;

    if (!video.id) video.id = uniqueId(document, 'video');
    button.setAttribute('aria-controls', video.id);
    button.hidden = false;
    video.autoplay = false;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    const state = (value) => {
      card.setAttribute('data-oj-video-state', value);
      button.textContent =
        value === 'playing' || value === 'loading' ? pauseLabel : playLabel;
    };
    const pause = (value = 'paused') => {
      desired = false;
      attempt++;
      video.pause();
      state(value);
    };
    const play = () => {
      if (!active || !video.isConnected || document.hidden) return;
      desired = true;
      const ticket = ++attempt;
      state('loading');
      // A disabled autoplay policy or media failure must leave manual playback available.
      Promise.resolve()
        .then(() => {
          if (!active || !desired || ticket !== attempt) return;
          return video.play();
        })
        .then(() => {
          if (!active || ticket !== attempt) return;
          if (!desired) {
            video.pause();
            return;
          }
          if (ticket === attempt) state('playing');
        })
        .catch(() => {
          if (!active || ticket !== attempt) return;
          manual = true;
          pause('blocked');
        });
    };
    const update = () => {
      if (!active) return;
      if (!visible || document.hidden) pause();
      else if (motion?.matches) {
        if (!manual) pause();
      } else if (!manual && !desired) play();
    };
    const observer = new window.IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target !== video) continue;
          visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
          update();
        }
      },
      { threshold: 0.35 },
    );
    listen(
      button,
      'click',
      () => {
        manual = true;
        if (desired || !video.paused) pause();
        else play();
      },
      callbacks,
    );
    listen(
      video,
      'play',
      () => {
        if (!active || video.paused) return;
        if (!desired) manual = true;
        desired = true;
        state('playing');
      },
      callbacks,
    );
    listen(
      video,
      'pause',
      () => {
        if (!active || !video.paused) return;
        if (desired) manual = true;
        desired = false;
        if (card.getAttribute('data-oj-video-state') !== 'blocked')
          state('paused');
      },
      callbacks,
    );
    listen(
      video,
      'error',
      () => {
        manual = true;
        pause('blocked');
      },
      callbacks,
    );
    listen(document, 'visibilitychange', update, callbacks);
    if (motion) listen(motion, 'change', update, callbacks);
    state('paused');
    video.pause();
    observer.observe(video);
    return () => {
      active = false;
      desired = false;
      attempt++;
      observer.disconnect();
      cleanupAll(callbacks)();
      video.pause();
      Object.assign(video, original);
      restoreVideo();
      button.replaceChildren(...originalText);
      restoreButton();
      restoreCard();
    };
  });
}
