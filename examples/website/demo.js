import { toast } from 'oj-designsystem';

export function setupJournal(root) {
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  root.querySelector('#journal-search').addEventListener(
    'input',
    (event) => {
      const query = event.target.value.trim().toLocaleLowerCase();
      let visible = 0;
      root.querySelectorAll('[data-journal-card]').forEach((card) => {
        card.hidden = !card.textContent.toLocaleLowerCase().includes(query);
        if (!card.hidden) visible += 1;
      });
      root.querySelector('[data-search-status]').textContent =
        `${visible} ${visible === 1 ? 'note' : 'notes'}${query ? ' match your search' : ''}`;
    },
    options,
  );
  root.querySelector('[data-contact-form]').addEventListener(
    'submit',
    (event) => {
      event.preventDefault();
      toast('Message preview is valid. No message was sent.', {
        type: 'success',
        root: root.closest('[data-oj-theme]') || root,
      });
    },
    options,
  );
  return () => listeners.abort();
}
