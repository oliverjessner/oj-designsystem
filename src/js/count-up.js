import { initialize, ownerDocument, rememberAttributes } from './internal.js';

const instances = new WeakMap();
const numberPattern = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;

function options(element, document) {
  const raw = element.getAttribute('data-oj-count-up')?.trim() || '';
  const target = Number(raw);
  if (
    !numberPattern.test(raw) ||
    !Number.isFinite(target) ||
    Math.abs(target) > Number.MAX_SAFE_INTEGER ||
    element.childElementCount
  )
    return;

  const fraction = raw.split('.')[1]?.length || 0;
  const rawDecimals = element.getAttribute('data-oj-count-decimals');
  const decimals =
    rawDecimals === null ? Math.min(fraction, 20) : Number(rawDecimals);
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 20) return;

  let formatter;
  try {
    formatter = new Intl.NumberFormat(
      element.getAttribute('data-oj-count-locale') ||
        element.closest('[lang]')?.getAttribute('lang') ||
        document.documentElement.lang ||
        undefined,
      { minimumFractionDigits: decimals, maximumFractionDigits: decimals },
    );
  } catch {
    return;
  }
  const duration = Number(element.getAttribute('data-oj-count-duration'));
  const delay = Number(element.getAttribute('data-oj-count-delay'));
  return {
    target,
    formatter,
    decimals,
    duration: Number.isFinite(duration) && duration > 0 ? duration : 1800,
    delay: Number.isFinite(delay) && delay >= 0 ? delay : 0,
    prefix: element.getAttribute('data-oj-count-prefix') || '',
    suffix: element.getAttribute('data-oj-count-suffix') || '',
  };
}

/** One viewport-triggered animation per owned element; final HTML is the fallback. */
export function initCountUps(root) {
  return initialize(root, '[data-oj-count-up]', instances, (element) => {
    const document = ownerDocument(element);
    const window = document?.defaultView;
    const configuration = options(element, document);
    const motion = window?.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (
      !configuration ||
      !window?.IntersectionObserver ||
      !window.requestAnimationFrame ||
      motion?.matches
    )
      return;

    const originalNodes = [...element.childNodes];
    const finalText = element.textContent;
    const hadClass = element.classList.contains('oj-count-up');
    const restoreState = rememberAttributes(element, ['data-oj-count-state']);
    let active = true;
    let started = false;
    let complete = false;
    let frameId;
    let current;

    const restoreContent = () => {
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
      frameId = undefined;
      if (started) element.replaceChildren(...originalNodes);
      if (!hadClass) element.classList.remove('oj-count-up');
    };
    const finish = () => {
      if (!active || complete) return;
      complete = true;
      observer.disconnect();
      restoreContent();
      element.setAttribute('data-oj-count-state', 'complete');
    };
    const start = () => {
      if (!active || started || complete) return;
      if (motion?.matches) return finish();
      started = true;
      observer.disconnect();
      const accessible = document.createElement('span');
      accessible.className = 'oj-sr-only';
      accessible.textContent = finalText;
      const reserve = document.createElement('span');
      reserve.className = 'oj-count-up-reserve';
      reserve.setAttribute('aria-hidden', 'true');
      reserve.textContent = finalText;
      current = document.createElement('span');
      current.className = 'oj-count-up-current';
      current.setAttribute('aria-hidden', 'true');
      const format = (value) =>
        configuration.prefix +
        configuration.formatter.format(value) +
        configuration.suffix;
      current.textContent = format(0);
      element.classList.add('oj-count-up');
      element.replaceChildren(accessible, reserve, current);
      element.setAttribute('data-oj-count-state', 'running');
      const startTime = window.performance.now() + configuration.delay;
      const frame = (now) => {
        frameId = undefined;
        if (!active) return;
        if (motion?.matches || !element.isConnected) return finish();
        const progress = Math.min(
          1,
          Math.max(0, (now - startTime) / configuration.duration),
        );
        if (progress === 1) return finish();
        const eased = 1 - (1 - progress) ** 3;
        const value = configuration.target * eased;
        current.textContent = format(
          configuration.decimals === 0 ? Math.trunc(value) : value,
        );
        frameId = window.requestAnimationFrame(frame);
      };
      frameId = window.requestAnimationFrame(frame);
    };
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (
          entries.some(
            (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.65,
          )
        )
          start();
      },
      { threshold: 0.65 },
    );
    const onMotionChange = () => {
      if (motion.matches) finish();
    };
    element.setAttribute('data-oj-count-state', 'pending');
    observer.observe(element);
    motion?.addEventListener('change', onMotionChange);
    return () => {
      active = false;
      observer.disconnect();
      motion?.removeEventListener('change', onMotionChange);
      restoreContent();
      restoreState();
    };
  });
}
