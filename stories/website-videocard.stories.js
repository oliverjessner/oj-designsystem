import { story } from './helpers.js';
import clip from './assets/sample.mp4';
import captions from './assets/sample.vtt?url';
import poster from './assets/overview.svg';

export default { title: 'Website/Video Card' };

const card = (variant = '', preview = false, suffix = 'native') => `
  <article class="oj-card oj-video-card ${variant}" ${preview ? 'data-oj-video-preview' : ''} aria-labelledby="video-${suffix}-title">
    <video class="oj-video-card-media" controls playsinline preload="metadata" poster="${poster}" aria-label="Silent sample: three fading bands">
      <source src="${clip}" type="video/mp4">
      <track kind="captions" src="${captions}" srclang="en" label="English">
      <a class="oj-link" href="${clip}">Download the sample video</a>
    </video>
    <div class="oj-card-body">
      <p class="oj-card-meta"><span>Local sample</span><span>8 seconds · silent</span></p>
      <h3 class="oj-card-title" id="video-${suffix}-title">Three fading bands</h3>
      <p class="oj-text oj-soft">Original local media demonstrates native playback and captions.</p>
      <div class="oj-card-actions">${preview ? '<button class="oj-button oj-button-secondary" type="button" data-oj-video-toggle hidden>Play preview</button>' : ''}<a class="oj-link" href="${clip}">Download video</a></div>
    </div>
  </article>`;

export const NativePlayback = story(
  `<div class="oj-grid">${card()}${card('oj-video-card-portrait', false, 'portrait')}${card('oj-video-card-square', false, 'square')}</div>`,
  'Landscape, portrait and square containers use native video controls. Media is contained so controls and captions remain visible. Supply correctly framed source media for each format.',
);

export const ViewportPreview = story(
  `<div class="oj-grid">${card('', true, 'preview')}</div>`,
  'Opt-in muted looping preview starts when visible and pauses offscreen, in a hidden tab or with reduced motion. A visible native button supports keyboard pause/play; explicit manual pauses persist.',
);
