import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures.html');
  await page.waitForFunction(() => !!window.oj);
  await page.evaluate(() => {
    const host = document.createElement('section');
    host.className = 'oj-stack';
    host.id = 'multiselect-demo';
    host.style.maxWidth = '380px';
    const before = document.createElement('input');
    before.setAttribute('aria-label', 'Before topics');
    const after = document.createElement('input');
    after.setAttribute('aria-label', 'After topics');
    window.picker = window.oj.createMultiselect({
      label: 'Topics',
      options: [
        { value: 'research', label: 'Research' },
        { value: 'design', label: 'Design' },
        { value: 'archive', label: 'Archive', disabled: true },
        {
          value: 'cafe',
          label:
            'Café and international collaboration with long descriptive labels',
        },
      ],
    });
    window.changes = [];
    host.addEventListener('oj:change', (event) =>
      window.changes.push(event.detail),
    );
    host.append(before, window.picker.node, after);
    document.querySelector('main').prepend(host);
  });
});

test('search, multiple selection, reset and public changes work with real native controls', async ({
  page,
}) => {
  const trigger = page.locator('.oj-multiselect-trigger');
  await trigger.click();
  const search = page.getByRole('searchbox', { name: 'Search options' });
  await expect(search).toBeFocused();
  await page.getByRole('checkbox', { name: 'Research', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Design', exact: true }).check();
  await expect(trigger).toHaveText('2 selected');
  await expect(trigger).toHaveAttribute('title', 'Research, Design');
  await search.fill('  CAFE\u0301  ');
  await expect(
    page.locator('.oj-multiselect-panel').getByRole('checkbox'),
  ).toHaveCount(1);
  await expect(
    page.locator('.oj-multiselect-panel').getByRole('checkbox'),
  ).toHaveAccessibleName(/Café/);
  await search.fill('unknown');
  await expect(page.getByText('No options found.')).toBeVisible();
  await page.getByRole('button', { name: 'Reset selection' }).click();
  await expect(search).toBeFocused();
  await expect(trigger).toHaveText('Select options');
  expect(
    await page.evaluate(() =>
      window.changes.map(({ value, source }) => ({ value, source })),
    ),
  ).toEqual([
    { value: ['research'], source: 'input' },
    { value: ['research', 'design'], source: 'input' },
    { value: [], source: 'reset' },
  ]);
});

test('keyboard opens, searches, skips disabled choices, selects and returns focus on Escape', async ({
  page,
}) => {
  const trigger = page.locator('.oj-multiselect-trigger');
  const search = page.getByRole('searchbox', { name: 'Search options' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(search).toBeFocused();
  await page.keyboard.press('ArrowDown');
  const research = page.getByRole('checkbox', {
    name: 'Research',
    exact: true,
  });
  await expect(research).toBeFocused();
  await page.keyboard.press('Space');
  await expect(research).toBeChecked();
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('checkbox', { name: 'Design', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('checkbox', { name: /Café/ })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(research).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('checkbox', { name: /Café/ })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Space');
  await expect(search).toBeFocused();
  await page.keyboard.press('Escape');
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('checkbox', { name: /Café/ })).toBeFocused();
});

test('Tab and Shift+Tab traverse the disclosure and leave without a focus trap', async ({
  page,
}) => {
  const trigger = page.locator('.oj-multiselect-trigger');
  await trigger.click();
  // Native Tab follows platform preferences for checkbox/button tab stops.
  // Every engine must nevertheless leave the disclosure and close it.
  for (let index = 0; index < 7; index++) {
    await page.keyboard.press('Tab');
    if (
      await page
        .getByRole('textbox', { name: 'After topics' })
        .evaluate((node) => node === document.activeElement)
    )
      break;
  }
  await expect(
    page.getByRole('textbox', { name: 'After topics' }),
  ).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  for (let index = 0; index < 3; index++) {
    await page.keyboard.press('Shift+Tab');
    if (
      await page
        .getByRole('textbox', { name: 'Before topics' })
        .evaluate((node) => node === document.activeElement)
    )
      break;
  }
  await expect(
    page.getByRole('textbox', { name: 'Before topics' }),
  ).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('outside dismissal and option replacement preserve useful focus and selection', async ({
  page,
}) => {
  await page.locator('.oj-multiselect-trigger').click();
  await page.getByRole('checkbox', { name: 'Design', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Design', exact: true }).focus();
  await page.evaluate(() =>
    window.picker.setOptions([{ value: 'design', label: 'Design updated' }], {
      emit: true,
    }),
  );
  await expect(
    page.getByRole('checkbox', { name: 'Design updated' }),
  ).toBeFocused();
  await expect(page.locator('.oj-multiselect-trigger')).toHaveText(
    'Design updated',
  );
  await page.getByRole('textbox', { name: 'Before topics' }).click();
  await expect(page.locator('.oj-multiselect-panel')).toBeHidden();
  await expect(
    page.getByRole('textbox', { name: 'Before topics' }),
  ).toBeFocused();
  await page.evaluate(() => window.picker.setOptions([], { emit: true }));
  await page.locator('.oj-multiselect-trigger').click();
  await expect(page.getByText('No options available.')).toBeVisible();
});

test('panels fit 240px to desktop widths, flip upward, follow scroll and escape clipping ancestors', async ({
  page,
}) => {
  const trigger = page.locator('.oj-multiselect-trigger');
  const panel = page.locator('.oj-multiselect-panel');
  for (const width of [240, 320, 768, 1440]) {
    await page.setViewportSize({ width, height: 700 });
    await page.evaluate(() => {
      const host = document.querySelector('#multiselect-demo');
      host.style.cssText =
        'position:fixed;right:8px;bottom:20px;width:180px;overflow:hidden;transform:translateZ(0);z-index:1';
    });
    await trigger.click();
    await expect(panel).toHaveAttribute('data-oj-placement', 'top');
    let box = await panel.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(8);
    expect(box.x + box.width).toBeLessThanOrEqual(width - 7);
    expect(box.y).toBeGreaterThanOrEqual(8);
    expect(box.y + box.height).toBeLessThanOrEqual(693);
    expect(
      await panel.evaluate((node) => {
        const box = node.getBoundingClientRect();
        return node.contains(
          document.elementFromPoint(box.x + box.width / 2, box.y + 16),
        );
      }),
    ).toBe(true);
    await page.setViewportSize({ width, height: 500 });
    await expect
      .poll(async () => {
        const resized = await panel.boundingBox();
        return resized.y + resized.height;
      })
      .toBeLessThanOrEqual(493);
    await page.keyboard.press('Escape');
  }
  await page.evaluate(() => {
    document.querySelector('#multiselect-demo').style.cssText =
      'max-width:380px';
  });
  await trigger.click();
  const before = await panel.boundingBox();
  await page.evaluate(() => window.scrollBy(0, 16));
  await expect
    .poll(async () => (await panel.boundingBox()).y)
    .toBeLessThan(before.y);
  await page.screenshot({ path: 'test-results/multiselect-desktop.png' });
  await page.setViewportSize({ width: 320, height: 700 });
  await page.screenshot({ path: 'test-results/multiselect-mobile.png' });
});

test('open and filtered states pass accessibility checks for all accents', async ({
  page,
}) => {
  await page.locator('.oj-multiselect-trigger').click();
  for (const accent of [
    '#22c55e',
    '#7d34c5',
    '#3b82f6',
    '#f97316',
    '#ef4444',
  ]) {
    await page.evaluate(
      (value) =>
        document.documentElement.style.setProperty('--oj-accent', value),
      accent,
    );
    await page.getByRole('checkbox', { name: 'Research', exact: true }).check();
    const result = await new AxeBuilder({ page })
      .include('#multiselect-demo')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
  await page.getByRole('searchbox', { name: 'Search options' }).fill('unknown');
  expect(
    (await new AxeBuilder({ page }).include('#multiselect-demo').analyze())
      .violations,
  ).toEqual([]);
});

test('inside a modal Escape closes only the multiselect and disposal removes behavior', async ({
  page,
}) => {
  await page.evaluate(() =>
    document
      .querySelector('#settings .oj-dialog-body')
      .append(window.picker.node),
  );
  await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
  const trigger = page.locator('.oj-multiselect-trigger');
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('dialog')).toBeVisible();
  await trigger.click();
  await page.evaluate(() => {
    window.picker.dispose();
    window.picker.dispose();
  });
  await expect(page.locator('.oj-multiselect-panel')).toBeHidden();
  await trigger.click();
  await expect(page.locator('.oj-multiselect-panel')).toBeHidden();
});
