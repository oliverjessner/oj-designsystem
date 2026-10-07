import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures.html');
  await page.waitForFunction(() => !!window.oj);
  await page.evaluate(() => document.fonts.ready);
});

test('Tab moves from the selected tab to its readable text panel', async ({
  page,
}) => {
  const tab = page.getByRole('tab', { name: 'Overview', exact: true });
  await tab.focus();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('tabpanel', { name: 'Overview', exact: true }),
  ).toBeFocused();
});

test('dropdown menus stay within the mobile viewport at either horizontal edge', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => {
    const root = document.createElement('section');
    root.style.display = 'flex';
    root.style.justifyContent = 'space-between';
    root.innerHTML = ['Left actions', 'Right actions']
      .map(
        (label) => `<div class="oj-dropdown" data-oj-dropdown>
      <button class="oj-button" data-oj-dropdown-trigger>${label}</button>
      <div class="oj-menu" data-oj-dropdown-menu hidden>
        <button class="oj-menu-item" role="menuitem">Export selected files</button>
        <button class="oj-menu-item" role="menuitem">Duplicate current selection</button>
      </div></div>`,
      )
      .join('');
    document.querySelector('main').prepend(root);
    window.oj.initDropdowns(root);
  });
  for (const label of ['Left actions', 'Right actions']) {
    await page.getByRole('button', { name: label, exact: true }).click();
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    const box = await menu.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(375);
    await page.keyboard.press('Escape');
  }
});

test('Tab and Shift+Tab leave a dropdown from its stable trigger origin', async ({
  page,
}) => {
  await page.evaluate(() => {
    const root = document.createElement('section');
    root.setAttribute('aria-label', 'Keyboard dropdown');
    // Native text fields remain in Safari's Tab order with either macOS
    // keyboard-navigation preference. The trigger and menu keep native buttons.
    root.innerHTML = `<input id="before-menu" aria-label="Before actions">
      <div class="oj-dropdown" data-oj-dropdown>
        <button id="keyboard-actions" class="oj-button" data-oj-dropdown-trigger>Keyboard actions</button>
        <div class="oj-menu" data-oj-dropdown-menu hidden>
          <button class="oj-menu-item" role="menuitem">Export report</button>
          <button class="oj-menu-item" role="menuitem">Rename report</button>
        </div>
      </div><input id="after-menu" aria-label="After actions">`;
    document.querySelector('main').append(root);
    window.oj.initOJ(root);
  });
  const trigger = page.locator('#keyboard-actions');
  await trigger.focus();
  await trigger.press('ArrowDown');
  await expect(
    page.getByRole('menuitem', { name: 'Export report' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#after-menu')).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.focus();
  await trigger.press('ArrowDown');
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#before-menu')).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('a tooltip inside a native modal remains above the backdrop and hoverable', async ({
  page,
}) => {
  await page.evaluate(() => {
    const dialog = document.querySelector('#settings');
    const trigger = document.createElement('button');
    trigger.className = 'oj-button';
    trigger.textContent = 'Modal explanation';
    trigger.setAttribute('data-oj-tooltip', 'A helpful modal explanation');
    dialog.querySelector('.oj-dialog-body').append(trigger);
    window.oj.initTooltips(dialog);
  });
  await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
  const trigger = page.getByRole('button', {
    name: 'Modal explanation',
    exact: true,
  });
  await trigger.hover();
  const tooltip = page.getByRole('tooltip', {
    name: 'A helpful modal explanation',
  });
  await expect(tooltip).toBeVisible();
  expect(
    await tooltip.evaluate((element) => element.closest('dialog')?.open),
  ).toBe(true);
  expect(
    await tooltip.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const hit = document.elementFromPoint(
        box.left + box.width / 2,
        box.top + box.height / 2,
      );
      return element === hit || element.contains(hit);
    }),
  ).toBe(true);
  await tooltip.hover();
  await expect(tooltip).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#settings [role="tooltip"]')).toBeHidden();
});

test('declarative dialog initialization works inside a scoped shadow root', async ({
  page,
}) => {
  await page.evaluate(() => {
    const host = document.createElement('section');
    host.id = 'shadow-demo';
    document.querySelector('main').append(host);
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `<button data-oj-dialog-open="shadow-dialog">Open shadow dialog</button>
      <dialog id="shadow-dialog" data-oj-dialog aria-labelledby="shadow-title">
        <h2 id="shadow-title">Shadow settings</h2>
        <label for="shadow-name">Shadow name</label><input id="shadow-name" autofocus>
        <button data-oj-dialog-close="saved">Save shadow settings</button>
      </dialog>`;
    window.oj.initDialogs(root);
  });
  const trigger = page.getByRole('button', { name: 'Open shadow dialog' });
  await trigger.click();
  await expect(
    page.getByRole('dialog', { name: 'Shadow settings' }),
  ).toBeVisible();
  await expect(
    page.getByRole('textbox', { name: 'Shadow name' }),
  ).toBeFocused();
  await page.getByRole('button', { name: 'Save shadow settings' }).click();
  await expect(page.locator('#shadow-demo dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#shadow-demo dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('shadow-root menus keep keyboard state and tooltips keep their ARIA target in the same tree', async ({
  page,
}) => {
  await page.evaluate(() => {
    const host = document.createElement('section');
    host.id = 'shadow-controls';
    document.querySelector('main').append(host);
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `<link rel="stylesheet" href="/dist/styles.css">
      <div class="oj-root oj-stack">
        <div class="oj-dropdown" data-oj-dropdown>
          <button class="oj-button" data-oj-dropdown-trigger>Shadow actions</button>
          <div class="oj-menu" data-oj-dropdown-menu hidden>
            <button class="oj-menu-item" role="menuitem">Shadow export</button>
            <button class="oj-menu-item" role="menuitem">Shadow rename</button>
          </div>
        </div>
        <button class="oj-button" data-oj-tooltip="A shadow description">Shadow help</button>
      </div>`;
    window.oj.initOJ(root);
  });
  const trigger = page.getByRole('button', {
    name: 'Shadow actions',
    exact: true,
  });
  await trigger.click();
  await expect(
    page.getByRole('menuitem', { name: 'Shadow export', exact: true }),
  ).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitem', { name: 'Shadow rename', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  const help = page.getByRole('button', { name: 'Shadow help', exact: true });
  await help.focus();
  await expect(
    page.getByRole('tooltip', { name: 'A shadow description' }),
  ).toBeVisible();
  expect(
    await help.evaluate((element) => {
      const id = element.getAttribute('aria-describedby');
      return element.getRootNode().getElementById(id)?.textContent;
    }),
  ).toBe('A shadow description');
  await page.keyboard.press('Escape');
  await expect(page.locator('#shadow-controls [role="tooltip"]')).toBeHidden();
});

test('native keyboard dialog opening and Escape cancellation retain focus', async ({
  page,
}) => {
  const trigger = page.getByRole('button', {
    name: 'Open dialog',
    exact: true,
  });
  await trigger.focus();
  await trigger.press('Enter');
  await expect(page.locator('#dialog-name')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#settings')).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.press('Space');
  await expect(page.locator('#dialog-name')).toBeFocused();
  await page.getByRole('button', { name: 'Close', exact: true }).press('Enter');
  await expect(trigger).toBeFocused();
});

test('confirmation cancellation uses native Escape and safe text while restoring focus', async ({
  page,
}) => {
  const opener = page.getByRole('button', { name: 'Delete', exact: true });
  await opener.focus();
  await page.evaluate(() => {
    window.confirmResult = undefined;
    window.oj
      .confirmDialog({
        title: 'Delete project?',
        message: '<img src=x onerror=alert(1)>',
        confirmLabel: 'Delete permanently',
        variant: 'danger',
      })
      .then((result) => {
        window.confirmResult = result;
      });
  });
  const dialog = page.getByRole('dialog', { name: 'Delete project?' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('<img src=x onerror=alert(1)>');
  await expect(dialog.locator('img')).toHaveCount(0);
  await expect(
    dialog.getByRole('button', { name: 'Cancel', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => window.confirmResult))
    .toBe(false);
});
