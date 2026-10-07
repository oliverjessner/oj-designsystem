import { story, notify } from './helpers.js';

export default { title: 'Components/Toast' };

export const Notifications = story(
  `<div class="oj-cluster"><button class="oj-button oj-button-primary" data-toast="success">Export complete</button><button class="oj-button oj-button-secondary" data-toast="warning">Review output</button><button class="oj-button oj-button-danger" data-toast="danger">Write failed</button><button class="oj-button oj-button-ghost" data-toast="persistent">Persistent message</button></div>`,
  'Notifications stack, announce their text and provide dismiss buttons. Hover/focus pauses timed dismissal; essential feedback should persist elsewhere in the UI.',
  (root) => {
    root.querySelectorAll('[data-toast]').forEach((button) => {
      button.addEventListener('click', () => {
        const kind = button.dataset.toast;
        if (kind === 'persistent') {
          import('oj-designsystem').then(({ toast }) => {
            toast('A persistent review message.', {
              duration: 0,
              root: root.closest('[data-oj-theme]') || root,
            });
          });
        } else {
          notify(root, button.textContent, kind);
        }
      });
    });
  },
);
