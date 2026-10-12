import { expect, test } from '@playwright/test';

const load = async (page) => {
  await page.goto('/tests/fixtures.html');
  await page.waitForFunction(() => !!window.oj);
  await page.evaluate(() => document.fonts.ready);
};

test('count-up starts on visibility, reserves width, keeps accessible text and runs once', async ({
  page,
}) => {
  await load(page);
  const value = page.locator('[data-oj-count-up="30000"]');
  await expect(value).toHaveAttribute('data-oj-count-state', 'pending');
  const initial = await value.boundingBox();
  await value.scrollIntoViewIfNeeded();
  await expect(value).toHaveAttribute('data-oj-count-state', 'running');
  await expect(value.locator('.oj-sr-only')).toHaveText('30.000');
  await expect(value.locator('.oj-count-up-current')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  const during = await value.boundingBox();
  expect(Math.abs(during.width - initial.width)).toBeLessThan(1);
  await expect(value).toHaveAttribute('data-oj-count-state', 'complete');
  await expect(value).toHaveText('30.000');
  await page.evaluate(() => {
    window.oj.initCountUps(document.querySelector('.oj-big-number-section'))();
    scrollTo(0, 0);
  });
  await value.scrollIntoViewIfNeeded();
  await expect(value).toHaveAttribute('data-oj-count-state', 'complete');
  await expect(value.locator('.oj-count-up-current')).toHaveCount(0);
});

test('reduced motion keeps authored values and stops an active animation immediately', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await load(page);
  const value = page.locator('[data-oj-count-up="1000"]');
  await expect(value).toHaveText('1.000h');
  await expect(value).not.toHaveAttribute('data-oj-count-state');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() =>
    window.oj.initCountUps(document.querySelector('.oj-big-number-section')),
  );
  await value.scrollIntoViewIfNeeded();
  await expect(value).toHaveAttribute('data-oj-count-state', 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(value).toHaveAttribute('data-oj-count-state', 'complete');
  await expect(value).toHaveText('1.000h');
  await expect(value.locator('.oj-count-up-current')).toHaveCount(0);
});

test('final numbers remain readable without JavaScript or observer support', async ({
  browser,
  baseURL,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const staticPage = await context.newPage();
    await staticPage.goto(`${baseURL}/tests/fixtures.html`);
    await expect(staticPage.locator('[data-oj-count-up="1000"]')).toHaveText(
      '1.000h',
    );
    await expect(staticPage.locator('[data-oj-count-up="30000"]')).toHaveText(
      '30.000',
    );
    await expect(
      staticPage.getByRole('region', { name: 'Research in numbers' }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
  await page.addInitScript(() => {
    window.IntersectionObserver = undefined;
  });
  await load(page);
  await expect(page.locator('[data-oj-count-up="30000"]')).toHaveText('30.000');
  await expect(page.locator('[data-oj-count-state]')).toHaveCount(0);
});

test('cleanup restores original content and a new owned scope can animate again', async ({
  page,
}) => {
  await load(page);
  const value = page.locator('[data-oj-count-up="10000"]');
  await value.scrollIntoViewIfNeeded();
  await expect(value).toHaveAttribute('data-oj-count-state', 'running');
  await page.evaluate(() => window.cleanupOJ());
  await expect(value).toHaveText('10.000');
  await expect(value).not.toHaveAttribute('data-oj-count-state');
  await expect(value).not.toHaveClass(/oj-count-up/);
  await page.evaluate(() => {
    window.cleanupCounts = window.oj.initCountUps(
      document.querySelector('.oj-big-number-section'),
    );
  });
  await expect(value).toHaveAttribute('data-oj-count-state', 'running');
  await expect(value).toHaveAttribute('data-oj-count-state', 'complete');
  await page.evaluate(() => window.cleanupCounts());
  await expect(value).not.toHaveAttribute('data-oj-count-state');
});

test('animation preserves native keyboard order without introducing focus stops', async ({
  page,
}) => {
  await load(page);
  await page.evaluate(() => {
    const section = document.createElement('section');
    section.setAttribute('aria-label', 'Counter keyboard check');
    section.innerHTML =
      '<input class="oj-input" aria-label="Before count"><span data-oj-count-up="1000">1,000</span><input class="oj-input" aria-label="After count">';
    document.querySelector('main').prepend(section);
    window.oj.initCountUps(section);
  });
  const before = page.getByRole('textbox', { name: 'Before count' });
  await before.focus();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('textbox', { name: 'After count' }),
  ).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(before).toBeFocused();
});

test('big numbers and long totals fit narrow containers in either text direction', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await load(page);
  const section = page.locator('.oj-big-number-section');
  await page.evaluate(() => {
    const value = document.querySelector('[data-oj-count-up="10000"]');
    value.textContent = '1.234.567.890';
  });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const direction of ['ltr', 'rtl']) {
      await section.evaluate((node, value) => {
        node.dir = value;
      }, direction);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await section.evaluate((node) =>
          [...node.querySelectorAll('.oj-big-number-value')].every(
            (value) => value.scrollWidth <= value.clientWidth + 1,
          ),
        ),
      ).toBe(true);
    }
  }
});
