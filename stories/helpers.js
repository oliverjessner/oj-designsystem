import { toast } from 'oj-designsystem';

// Markup supplied to this helper consists only of repository-authored examples.
// Runtime text belongs in textContent; this is not an HTML escaping API.
export function demo(markup, description = '', setup) {
  const root = document.createElement('section');
  root.className = 'oj-story-demo';
  if (description) {
    const caption = document.createElement('p');
    caption.className = 'oj-muted oj-story-caption';
    caption.textContent = description;
    root.append(caption);
  }
  const content = document.createElement('div');
  content.innerHTML = markup;
  root.append(content);
  root.ojStoryCleanup = setup?.(root);
  return root;
}

export function story(markup, description = '', setup) {
  return { render: () => demo(markup, description, setup) };
}

export function notify(root, message, type = 'success') {
  return toast(message, {
    type,
    root: root.closest('[data-oj-theme]') || root,
  });
}

export const icon = (name) =>
  `<i class="fa-solid fa-${name}" aria-hidden="true"></i>`;
