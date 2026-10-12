import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const load = async (page) => {
  await page.goto('/tests/website-fixtures.html');
  await page.waitForFunction(() => !!window.oj);
  await page.evaluate(() => document.fonts.ready);
};

test('website sections remain accessible with all accent presets', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await load(page);
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
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
  await expect(page.getByRole('list')).toHaveCount(2);
  await expect(page.locator('.oj-steps').getByRole('listitem')).toHaveCount(4);
});

test('website sections fit mobile and embedded widths in both text directions', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await load(page);
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const direction of ['ltr', 'rtl']) {
      await page.locator('main').evaluate((node, value) => {
        node.dir = value;
      }, direction);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
  await page.locator('main').evaluate((node) => {
    node.dir = 'ltr';
    node.style.inlineSize = '240px';
  });
  const hero = page.locator('.oj-hero-grid');
  const copy = await page.locator('.oj-hero-copy').boundingBox();
  const media = await page.locator('.oj-hero-media').boundingBox();
  expect(media.y).toBeGreaterThan(copy.y + copy.height);
  expect(
    await hero.evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBe(true);
  expect(
    await page
      .locator('main')
      .evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBe(true);
});

test('video preview plays when visible and keyboard pause persists after re-entry', async ({
  page,
}) => {
  await load(page);
  await page.setViewportSize({ width: 768, height: 900 });
  const card = page.locator('[data-oj-video-preview]');
  const video = card.locator('video');
  await expect(card).toHaveAttribute('data-oj-video-state', 'paused');
  await video.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-oj-video-state', 'playing');
  const pause = card.getByRole('button', { name: 'Pause preview' });
  await pause.focus();
  await pause.press('Enter');
  const play = card.getByRole('button', { name: 'Play preview' });
  await expect(play).toBeFocused();
  await expect(card).toHaveAttribute('data-oj-video-state', 'paused');
  await page.evaluate(() => scrollTo(0, 0));
  await video.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-oj-video-state', 'paused');
  await play.press('Space');
  await expect(card).toHaveAttribute('data-oj-video-state', 'playing');
  await expect(
    card.getByRole('button', { name: 'Pause preview' }),
  ).toBeFocused();
  await page.evaluate(() => scrollTo(0, 0));
  await expect(card).toHaveAttribute('data-oj-video-state', 'paused');
});

test('video preview respects reduced motion and cleans up media/control ownership', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await load(page);
  await page.setViewportSize({ width: 768, height: 900 });
  const card = page.locator('[data-oj-video-preview]');
  await card.locator('video').scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-oj-video-state', 'paused');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(card).toHaveAttribute('data-oj-video-state', 'playing');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(card).toHaveAttribute('data-oj-video-state', 'paused');
  await page.evaluate(() => window.cleanupOJ());
  await expect(card).not.toHaveAttribute('data-oj-video-state');
  await expect(card.locator('[data-oj-video-toggle]')).toBeHidden();
  expect(
    await card
      .locator('video')
      .evaluate(
        (node) => node.paused && node.controls && !node.muted && !node.loop,
      ),
  ).toBe(true);
});

test('website sections and native video remain usable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/tests/website-fixtures.html`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Understand technology',
    );
    await expect(
      page.getByRole('link', { name: 'Explore the method video' }),
    ).toBeVisible();
    await expect(page.locator('.oj-steps').getByRole('listitem')).toHaveCount(
      4,
    );
    await expect(page.locator('video')).toHaveAttribute('controls', '');
    await expect(page.locator('[data-oj-video-toggle]')).toBeHidden();
    await expect(
      page.getByRole('link', { name: 'Download video', exact: true }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
