import { confirmDialog, toast } from 'oj-designsystem';

const starterFiles = [
  { name: 'article-header.jpg', type: 'JPEG', size: 843776 },
  { name: 'product-photo.png', type: 'PNG', size: 1032192 },
  { name: 'screenshot.webp', type: 'WebP', size: 471040 },
];

function formatSize(bytes) {
  return bytes >= 1048576
    ? `${(bytes / 1048576).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

export function setupTool(root) {
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  let files = starterFiles.map((file) => ({ ...file }));
  let selected = files[0];
  let direction = 1;
  const get = (selector) => root.querySelector(selector);
  const notify = (message, type = 'success') =>
    toast(message, { type, root: root.closest('[data-oj-theme]') || root });

  function render() {
    const query = get('#tool-search').value.trim().toLocaleLowerCase();
    const filtered = files.filter((file) =>
      file.name.toLocaleLowerCase().includes(query),
    );
    filtered.sort(
      (left, right) => left.name.localeCompare(right.name) * direction,
    );
    const rows = get('[data-file-rows]');
    rows.replaceChildren();
    for (const file of filtered) {
      const row = document.createElement('tr');
      if (file === selected) row.dataset.ojState = 'selected';
      const nameCell = document.createElement('td');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'oj-button oj-button-ghost oj-button-compact';
      button.textContent = file.name;
      button.setAttribute('aria-pressed', String(file === selected));
      button.addEventListener(
        'click',
        () => {
          selected = file;
          render();
          get('[data-oj-state="selected"] button')?.focus();
        },
        options,
      );
      nameCell.append(button);
      row.append(nameCell);
      for (const [value, className] of [
        [file.type, 'oj-mono'],
        [formatSize(file.size), 'oj-mono oj-numeric'],
        ['Ready', ''],
      ]) {
        const cell = document.createElement('td');
        cell.className = className;
        cell.textContent = value;
        row.append(cell);
      }
      rows.append(row);
    }
    get('[data-file-count]').textContent =
      `${files.length} ${files.length === 1 ? 'file' : 'files'}`;
    get('[data-summary-count]').textContent = String(files.length);
    get('[data-summary-size]').textContent = formatSize(
      files.reduce((sum, file) => sum + file.size, 0),
    );
    get('[data-inspector-name]').textContent =
      selected?.name || 'No file selected';
    get('[data-inspector-size]').textContent = selected
      ? formatSize(selected.size)
      : '—';
    get('[data-files-empty]').hidden = filtered.length > 0;
    get('[data-preview-export]').disabled = files.length === 0;
  }

  get('#tool-search').addEventListener('input', render, options);
  get('[data-sort-name]').addEventListener(
    'click',
    () => {
      direction *= -1;
      get('[data-sort-name]')
        .closest('th')
        .setAttribute(
          'aria-sort',
          direction === 1 ? 'ascending' : 'descending',
        );
      const icon = get('[data-sort-name] i');
      icon.className = `fa-solid fa-arrow-${direction === 1 ? 'up' : 'down'}`;
      render();
    },
    options,
  );
  get('[data-choose-files]').addEventListener(
    'click',
    () => get('[data-file-input]').click(),
    options,
  );
  get('[data-file-input]').addEventListener(
    'change',
    (event) => {
      const added = Array.from(event.target.files, (file) => ({
        name: file.name,
        type: file.type.split('/')[1]?.toUpperCase() || 'File',
        size: file.size,
      }));
      files.push(...added);
      if (!selected) selected = files[0];
      render();
      notify(`${added.length} files added to the local preview.`);
      event.target.value = '';
    },
    options,
  );
  get('#tool-quality').addEventListener(
    'input',
    (event) => {
      get('[data-quality-output]').textContent = `${event.target.value}%`;
    },
    options,
  );
  get('[data-preview-export]').addEventListener(
    'click',
    () => {
      get('[data-tool-status]').textContent = 'Preview ready';
      notify(
        `Preview: ${files.length} files → ${get('#tool-format').value}. No files were converted.`,
      );
    },
    options,
  );
  get('[data-oj-dropdown]').addEventListener(
    'oj:select',
    async (event) => {
      if (event.detail.value === 'reset') {
        files = starterFiles.map((file) => ({ ...file }));
        selected = files[0];
        get('#tool-search').value = '';
        render();
        notify('Demo files restored.');
      } else if (event.detail.value === 'remove' && selected) {
        const file = selected;
        // Let the action menu close and restore its trigger before opening a modal.
        await Promise.resolve();
        const confirmed = await confirmDialog({
          title: 'Remove file from queue?',
          message: `Remove ${file.name} from this preview? The source file is unchanged.`,
          confirmLabel: 'Remove',
          variant: 'danger',
          root: root.closest('[data-oj-theme]') || root,
        });
        if (confirmed) {
          files = files.filter((item) => item !== file);
          selected = files[0];
          render();
          notify('File removed from the preview.');
        }
      }
    },
    options,
  );
  render();
  return () => listeners.abort();
}
