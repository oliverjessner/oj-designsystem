import { expect, test } from '@playwright/test';

const markup = `
  <section class="oj-panel oj-stack" aria-label="Selection controls">
    <div class="oj-toolbar">
      <button class="oj-button" data-control="button">Actionword</button>
      <button class="oj-button" disabled data-control="disabled">Unavailable</button>
      <input class="oj-input" aria-label="Next keyboard target" id="next-keyboard-target" />
      <a class="oj-button" href="#selection" data-control="button-link">Continue</a>
      <button class="oj-icon-button" aria-label="Settings" data-control="icon">
        <i class="fa-solid fa-gear" aria-hidden="true"></i>
      </button>
      <button class="oj-tab" role="tab" data-control="tab">Overview</button>
    </div>
    <label class="oj-check" data-control="checkbox">
      <input class="oj-checkbox" type="checkbox" />
      <span>Checkword <span class="oj-helper" id="check-description">Explanation</span></span>
    </label>
    <label class="oj-check" data-control="radio">
      <input class="oj-radio" type="radio" name="selection-mode" />Radioword
    </label>
    <label class="oj-switch" data-control="switch">
      <input type="checkbox" /><span class="oj-switch-track" aria-hidden="true"></span>
      <span>Switchword <span class="oj-helper" id="switch-description">Details</span></span>
    </label>
    <fieldset class="oj-segmented">
      <legend id="segment-description">Format</legend>
      <label data-control="segment"><input type="radio" name="selection-format" checked /><span>JSON</span></label>
      <label><input type="radio" name="selection-format" /><span>CSV</span></label>
    </fieldset>
    <div class="oj-menu" role="menu" aria-label="Actions">
      <button class="oj-menu-item" role="menuitem" data-control="menu">Exportword</button>
    </div>
    <nav class="oj-nav" aria-label="Primary">
      <a class="oj-nav-link" href="#selection" data-control="navigation">Projects
        <span class="oj-badge" id="nested-navigation-badge">Countword</span>
      </a>
    </nav>
    <nav class="oj-breadcrumb" aria-label="Breadcrumb">
      <ol><li><a href="#selection" data-control="breadcrumb">Home</a></li>
      <li><span aria-current="page" id="breadcrumb-current">Current</span></li></ol>
    </nav>
    <nav class="oj-pagination" aria-label="Pages">
      <button class="oj-button" data-control="pagination">Next</button>
      <span id="pagination-status">Pagecount</span>
    </nav>
    <div class="oj-list">
      <button class="oj-list-item" data-control="list-button">Openword
        <span class="oj-tag" id="nested-list-tag">Topicword</span>
      </button>
      <a class="oj-list-item" href="#selection" data-control="list-link">Readword
        <span class="oj-badge" id="nested-list-badge">Statusword</span>
      </a>
      <div class="oj-list-item" id="list-content">Recordword</div>
    </div>
    <div class="oj-toast">
      <span id="toast-content">Completed</span>
      <button class="oj-icon-button oj-toast-dismiss" data-control="toast-dismiss" aria-label="Dismiss">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>
    <div class="oj-toolbar">
      <button class="oj-tag" data-control="tag">Filterword</button>
      <a class="oj-tag" href="#selection" data-control="tag-link">Category</a>
      <span class="oj-tag" id="static-tag">Taxonomy</span>
      <a class="oj-tag" id="tag-placeholder">Placeholder</a>
      <span class="oj-badge" id="static-badge">Ready</span>
    </div>
    <table class="oj-table">
      <caption id="table-caption">Projects</caption>
      <thead><tr><th><button class="oj-table-sort" data-control="sort">Sortword</button></th>
      <th id="static-header" scope="col">Status</th></tr></thead>
      <tbody><tr><td id="table-content">Research</td><td>Ready</td></tr></tbody>
    </table>
    <details class="oj-accordion" open>
      <summary data-control="accordion">Disclosureword</summary>
      <div class="oj-accordion-body" id="accordion-content">Documentation</div>
    </details>
    <div id="selection-multiselect"></div>
  </section>
  <section class="oj-panel oj-stack" aria-label="Copyable information">
    <h2 class="oj-heading-2" id="heading-content">Information</h2>
    <p id="plain-content">Paragraph</p>
    <p class="oj-helper oj-helper-error" id="error-content">Validation</p>
    <div class="oj-alert oj-alert-info" role="status" id="alert-content">Notification</div>
    <p class="oj-inline-message" id="inline-content">Message</p>
    <article class="oj-prose"><p id="prose-content">Read <a class="oj-link" href="#selection" id="prose-link">Reference</a> here</p></article>
    <pre class="oj-code-block"><code id="code-content">sourcecode</code></pre>
    <pre class="oj-code-block" id="log-content">logoutput</pre>
    <div class="oj-dropzone"><p id="dropzone-description">Description</p></div>
    <button class="oj-button" type="button" id="tooltip-host" data-oj-tooltip="Tooltipword">Help</button>
    <label class="oj-label" for="selection-input" id="input-label">Name</label>
    <input class="oj-input" id="selection-input" value="Editable input" />
    <input class="oj-input" id="selection-readonly-input" aria-label="Readonly input" readonly value="Readonly input" />
    <textarea class="oj-textarea" id="selection-textarea" aria-label="Editable textarea">Editable textarea</textarea>
    <textarea class="oj-textarea" id="selection-readonly-textarea" aria-label="Readonly textarea" readonly>Readonly textarea</textarea>
    <div class="oj-check">
      <input class="oj-input" id="nested-readonly-input" aria-label="Nested readonly input" readonly value="Nested input" />
      <textarea class="oj-textarea" id="nested-readonly-textarea" aria-label="Nested readonly textarea" readonly>Nested textarea</textarea>
    </div>
  </section>`;

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures.html');
  await page.waitForFunction(() => !!window.oj);
  await page.evaluate((html) => {
    window.cleanupOJ();
    document.querySelector('main').innerHTML = html;
    const picker = window.oj.createMultiselect({
      label: 'Categories',
      description: 'Description',
      options: [
        { value: 'research', label: 'Research' },
        { value: 'writing', label: 'Writing' },
      ],
    });
    document.querySelector('#selection-multiselect').append(picker.node);
    window.cleanupOJ = window.oj.initOJ();
  }, markup);
  await page.evaluate(() => document.fonts.ready);
});

async function selectWord(page, selector, gesture = 'double-click') {
  const target = page.locator(selector);
  await target.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.getSelection().removeAllRanges());
  const point = await target.evaluate((node) => {
    const range = document.createRange();
    range.selectNodeContents(node);
    const rect = range.getBoundingClientRect();
    return {
      start: rect.x + 1,
      end: rect.right - 1,
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };
  });
  if (gesture === 'drag') {
    await page.mouse.move(point.start, point.y);
    await page.mouse.down();
    await page.mouse.move(point.end, point.y, { steps: 12 });
    await page.mouse.up();
  } else {
    await page.mouse.dblclick(point.x, point.y);
  }
  return page.evaluate(() => window.getSelection().toString().trim());
}

test('only action controls suppress selection, including generated multiselect controls', async ({
  page,
}) => {
  const controls = page.locator('[data-control]');
  expect(await controls.count()).toBeGreaterThan(15);
  for (const control of await controls.all()) {
    await expect(control).toHaveCSS('user-select', 'none');
    expect(
      await control.evaluate(
        (node) =>
          getComputedStyle(node).getPropertyValue('-webkit-user-select') ||
          getComputedStyle(node).userSelect,
      ),
    ).toBe('none');
  }
  // Native buttons and links may prevent pointer selection of descendants
  // themselves. Keep informative descendants opt-in selectable regardless.
  for (const id of [
    'nested-navigation-badge',
    'nested-list-tag',
    'nested-list-badge',
  ]) {
    await expect(page.locator(`#${id}`)).toHaveCSS('user-select', 'text');
  }
  await expect(page.locator('#input-label')).not.toHaveCSS(
    'user-select',
    'none',
  );
  const trigger = page.locator('.oj-multiselect-trigger');
  await expect(trigger).toHaveCSS('user-select', 'none');
  await trigger.click();
  await expect(page.locator('.oj-multiselect-option').first()).toHaveCSS(
    'user-select',
    'none',
  );
  await expect(page.getByRole('button', { name: 'Reset selection' })).toHaveCSS(
    'user-select',
    'none',
  );
  await expect(
    page.getByRole('searchbox', { name: 'Search options' }),
  ).toHaveCSS('user-select', 'text');
  await expect(
    page.locator('.oj-multiselect-panel .oj-helper').first(),
  ).not.toHaveCSS('user-select', 'none');
});

test('mouse selection skips action text and still selects informative content', async ({
  page,
}) => {
  for (const control of ['button', 'menu', 'tag', 'sort', 'accordion']) {
    expect(await selectWord(page, `[data-control="${control}"]`, 'drag')).toBe(
      '',
    );
  }
  // Restore the native disclosure if pointer activation closed it.
  await page.locator('.oj-accordion').evaluate((node) => (node.open = true));
  const information = [
    ['#heading-content', 'Information'],
    ['#plain-content', 'Paragraph'],
    ['#error-content', 'Validation'],
    ['#alert-content', 'Notification'],
    ['#inline-content', 'Message'],
    ['#prose-content', 'Read Reference here', 'drag'],
    ['#code-content', 'sourcecode'],
    ['#log-content', 'logoutput'],
    ['#static-tag', 'Taxonomy'],
    ['#tag-placeholder', 'Placeholder'],
    ['#static-badge', 'Ready'],
    ['#table-caption', 'Projects'],
    ['#static-header', 'Status'],
    ['#table-content', 'Research'],
    ['#list-content', 'Recordword'],
    ['#toast-content', 'Completed'],
    ['#breadcrumb-current', 'Current'],
    ['#pagination-status', 'Pagecount'],
    ['#accordion-content', 'Documentation'],
    ['#segment-description', 'Format'],
    ['#dropzone-description', 'Description'],
    ['#check-description', 'Explanation'],
    ['#switch-description', 'Details'],
  ];
  for (const [selector, text, gesture] of information) {
    expect(await selectWord(page, selector, gesture), selector).toBe(text);
  }
  expect(await selectWord(page, '#plain-content', 'drag')).toBe('Paragraph');
  expect(await selectWord(page, '[data-control="button"]', 'drag')).toBe('');
  await page.locator('#tooltip-host').focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  expect(await selectWord(page, '.oj-tooltip')).toBe('Tooltipword');
});

test('editable and readonly fields preserve native keyboard selection', async ({
  page,
}) => {
  for (const id of [
    'selection-input',
    'selection-readonly-input',
    'selection-textarea',
    'selection-readonly-textarea',
    'nested-readonly-input',
    'nested-readonly-textarea',
  ]) {
    const field = page.locator(`#${id}`);
    await expect(field).toHaveCSS('user-select', 'text');
    await field.focus();
    await field.press('ControlOrMeta+A');
    expect(
      await field.evaluate((node) =>
        node.value.slice(node.selectionStart, node.selectionEnd),
      ),
    ).toBe(await field.inputValue());
  }
  const editable = page.locator('#selection-input');
  await editable.fill('Updated value');
  await expect(editable).toHaveValue('Updated value');
  const readonly = page.locator('#selection-readonly-input');
  await readonly.press('x');
  await expect(readonly).toHaveValue('Readonly input');
});

test('native activation, keyboard focus and disabled behavior remain intact', async ({
  page,
}) => {
  const checkbox = page.locator('[data-control="checkbox"] input');
  await checkbox.focus();
  await checkbox.press('Space');
  await expect(checkbox).toBeChecked();
  await expect(checkbox).toBeFocused();
  const toggle = page.locator('[data-control="switch"] input');
  await toggle.focus();
  await toggle.press('Space');
  await expect(toggle).toBeChecked();
  await expect(toggle).toBeFocused();
  const segments = page.locator('.oj-segmented input');
  await segments.first().focus();
  await segments.first().press('ArrowRight');
  await expect(segments.last()).toBeChecked();
  await expect(segments.last()).toBeFocused();
  const summary = page.locator('.oj-accordion summary');
  await summary.focus();
  await summary.press('Enter');
  await expect(page.locator('.oj-accordion')).not.toHaveAttribute('open');
  await summary.press('Space');
  await expect(page.locator('.oj-accordion')).toHaveAttribute('open');
  await expect(page.locator('[data-control="disabled"]')).toBeDisabled();
  await page.locator('[data-control="button"]').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#next-keyboard-target')).toBeFocused();
});
