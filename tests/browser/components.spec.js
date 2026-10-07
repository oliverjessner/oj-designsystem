import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const accents = {
  green: '#22c55e',
  purple: '#7d34c5',
  blue: '#3b82f6',
  orange: '#f97316',
  red: '#ef4444',
};
test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures.html');
  await page.waitForFunction(() => !!window.oj);
  await page.evaluate(() => document.fonts.ready);
});

for (const [name, accent] of Object.entries(accents)) {
  test(`AA component scan with ${name} accent`, async ({ page }) => {
    await page.evaluate(
      (value) =>
        document.documentElement.style.setProperty('--oj-accent', value),
      accent,
    );
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}

test('tabs skip disabled items and move selection with keyboard', async ({
  page,
}) => {
  const overview = page.getByRole('tab', { name: 'Overview' });
  await overview.focus();
  await overview.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'History' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'History' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('tabpanel')).toContainText('History of changes');
  await page.keyboard.press('Home');
  await expect(overview).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'History' })).toBeFocused();
});

test('menu keys, selection and focus return', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Actions', exact: true });
  await trigger.focus();
  await trigger.press('ArrowDown');
  await expect(
    page.getByRole('menuitem', { name: 'Open', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Duplicate' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('menuitem', { name: 'Duplicate' }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('native dialog keeps modal focus, escapes and restores trigger', async ({
  page,
}) => {
  const trigger = page.getByRole('button', {
    name: 'Open dialog',
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#dialog-name')).toBeFocused();
  await page.locator('#name').focus(); // Inert background controls cannot receive modal focus.
  await expect(page.locator('#dialog-name')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#dialog-note')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('tooltip uses a description and dismisses on Escape', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Settings', exact: true });
  await trigger.focus();
  await expect(page.getByRole('tooltip')).toHaveText('Settings');
  await expect(trigger).toHaveAttribute('aria-describedby', /oj-/);
  await trigger.press('Escape');
  await expect(page.locator('[role=tooltip]')).toBeHidden();
});

test('toast text is safe, live and dismissible', async ({ page }) => {
  await page.evaluate(() =>
    window.oj.toast('<img src=x onerror=alert(1)>', {
      type: 'success',
      duration: 0,
    }),
  );
  const toast = page.locator('.oj-toast');
  await expect(toast).toContainText('<img src=x onerror=alert(1)>');
  await expect(toast.locator('img')).toHaveCount(0);
  expect(await page.locator('[aria-live]').count()).toBeGreaterThan(0);
  await toast.getByRole('button').click();
  await expect(toast).toHaveCount(0);
});

test('local fonts and icons load with no external runtime requests', async ({
  page,
}) => {
  const failures = [];
  page.on('requestfailed', (request) => failures.push(request.url()));
  await page.reload();
  await page.waitForFunction(() => !!window.oj);
  await page.evaluate(() => document.fonts.ready);
  const result = await page.evaluate(() => ({
    sans: document.fonts.check('600 14px Comfortaa'),
    mono: document.fonts.check('400 14px "JetBrains Mono"'),
    icon: document.fonts.check('900 14px "Font Awesome 7 Free"'),
    loaded: [...document.fonts]
      .filter((font) => font.status === 'loaded')
      .map((font) => font.family),
    remote: performance
      .getEntriesByType('resource')
      .filter((entry) => new URL(entry.name).origin !== location.origin)
      .map((entry) => entry.name),
  }));
  expect(failures).toEqual([]);
  expect(result.remote).toEqual([]);
  expect(result.sans && result.mono && result.icon).toBe(true);
  expect(result.loaded).toContain('Comfortaa');
  expect(result.loaded).toContain('JetBrains Mono');
});

test('compact controls and prose fit mobile, tablet, laptop and desktop', async ({
  page,
}) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole('button', { name: 'Save changes' }),
    ).toBeVisible();
    await expect(page.locator('.oj-prose')).toBeVisible();
  }
});

test('reduced motion disables functional animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => {
    const spinner = document.createElement('span');
    spinner.className = 'oj-spinner';
    document.querySelector('main').append(spinner);
  });
  expect(
    await page
      .locator('.oj-spinner')
      .evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('none');
});

test('without JS all tab content remains readable', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/tests/fixtures.html`);
  await expect(page.locator('[role="tabpanel"]')).toHaveCount(3);
  for (const panel of await page.locator('[role="tabpanel"]').all())
    await expect(panel).toBeVisible();
  await context.close();
});

test('primary text maintains AA contrast through accent interaction states', async ({
  page,
}) => {
  const button = page.getByRole('button', { name: 'Save changes' });
  const contrast = () =>
    button.evaluate((node) => {
      const style = getComputedStyle(node);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      const rgb = (color) => {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
      };
      const luminance = (color) =>
        rgb(color)
          .map((part) => {
            const value = part / 255;
            return value <= 0.04045
              ? value / 12.92
              : ((value + 0.055) / 1.055) ** 2.4;
          })
          .reduce(
            (sum, value, index) =>
              sum + value * [0.2126, 0.7152, 0.0722][index],
            0,
          );
      const foreground = luminance(style.color);
      const background = luminance(style.backgroundColor);
      return (
        (Math.max(foreground, background) + 0.05) /
        (Math.min(foreground, background) + 0.05)
      );
    });
  const failures = [];
  for (const [name, value] of Object.entries(accents)) {
    await page.evaluate(
      (accent) =>
        document.documentElement.style.setProperty('--oj-accent', accent),
      value,
    );
    await page.mouse.move(1, 1);
    await button.evaluate((node) => node.blur());
    const normal = await contrast();
    await button.hover();
    await page.waitForTimeout(200);
    const hover = await contrast();
    await page.mouse.down();
    await page.waitForTimeout(200);
    const active = await contrast();
    await page.mouse.up();
    for (const [state, ratio] of Object.entries({ normal, hover, active }))
      if (ratio < 4.5) failures.push({ name, state, ratio });
  }
  expect(failures).toEqual([]);
});

test('nested themes inherit product tokens and recompute their own accent states', async ({
  page,
}) => {
  const colors = await page.evaluate(() => {
    document.documentElement.style.setProperty('--oj-accent', '#7d34c5');
    document.documentElement.style.setProperty(
      '--oj-font-sans',
      '"JetBrains Mono", monospace',
    );
    const root = document.createElement('section');
    root.dataset.ojTheme = 'dark';
    root.className = 'oj-root';
    const inherited = document.createElement('button');
    inherited.className = 'oj-button oj-button-primary';
    inherited.textContent = 'Inherited product';
    const nested = document.createElement('section');
    nested.dataset.ojTheme = 'dark';
    nested.style.setProperty('--oj-accent', '#3b82f6');
    const overridden = inherited.cloneNode(true);
    overridden.textContent = 'Nested product';
    nested.append(overridden);
    root.append(inherited, nested);
    document.querySelector('main').append(root);
    return [inherited, overridden].map((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        foreground: style.color,
        font: style.fontFamily,
      };
    });
  });
  expect(colors[0].background).toBe('rgb(125, 52, 197)');
  expect(colors[1].background).toBe('rgb(59, 130, 246)');
  expect(colors[0].foreground).not.toBe(colors[1].foreground);
  for (const color of colors) expect(color.font).toContain('JetBrains Mono');
});

test('coarse-pointer controls expose comfortable touch targets', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/tests/fixtures.html`);
  await page.waitForFunction(() => !!window.oj);
  expect(
    await page.evaluate(() => matchMedia('(pointer: coarse)').matches),
  ).toBe(true);
  for (const control of [
    page.getByRole('button', { name: 'Save changes' }),
    page.getByRole('button', { name: 'Settings', exact: true }),
    page.locator('#name'),
  ]) {
    const box = await control.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  await context.close();
});
