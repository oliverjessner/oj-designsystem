import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('every published Storybook story renders and passes WCAG checks', async ({
  page,
  request,
  browserName,
}) => {
  test.skip(
    browserName !== 'chromium',
    'The full story inventory runs once; runtime behavior runs in every engine.',
  );
  test.setTimeout(300000);
  const response = await request.get('/storybook-static/index.json');
  expect(response.ok(), 'Build Storybook before running browser tests.').toBe(
    true,
  );
  const index = await response.json();
  const stories = Object.values(index.entries).filter(
    (entry) => entry.type === 'story',
  );
  expect(stories.length).toBeGreaterThan(50);
  const findings = [];
  let currentStory;
  page.on('pageerror', (error) =>
    findings.push({ story: currentStory, error: error.message }),
  );
  page.on('console', (message) => {
    if (message.type() === 'error') {
      findings.push({ story: currentStory, error: message.text() });
    }
  });

  for (const story of stories) {
    currentStory = `${story.title} / ${story.name}`;
    await test.step(currentStory, async () => {
      // Request manual addon mode only for this external audit, avoiding two
      // simultaneous axe runs. Normal Storybook keeps its automatic addon scan.
      const globals = encodeURIComponent('a11y.manual:!true');
      const url = `/storybook-static/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&globals=${globals}`;
      try {
        await page.goto(url);
        await expect(
          page.locator('.oj-story-wrapper .oj-story-demo'),
        ).toBeVisible();
        // Wait for play functions and afterEach hooks, so the audit observes the
        // settled story rather than a menu/dialog halfway through its smoke test.
        await page.waitForFunction(
          (id) =>
            window.__STORYBOOK_PREVIEW__?.channel.last('storyFinished')?.[0]
              ?.storyId === id,
          story.id,
        );
        const completion = await page.evaluate(() => {
          const result =
            window.__STORYBOOK_PREVIEW__.channel.last('storyFinished')[0];
          return {
            status: result.status,
            failedReports: result.reporters
              ?.filter((report) => report.status === 'failed')
              .map(({ type, status }) => ({ type, status })),
          };
        });
        if (completion.status !== 'success') {
          findings.push({
            story: currentStory,
            error: 'Storybook play function or hooks reported a failure.',
            completion,
          });
        }
        await page.waitForFunction(() => {
          const wrapper = document.querySelector('.oj-story-wrapper');
          return (
            wrapper &&
            [...wrapper.querySelectorAll('[role="tab"]')].every(
              (tab) =>
                tab.hasAttribute('disabled') ||
                tab.getAttribute('aria-disabled') === 'true' ||
                tab.hasAttribute('aria-controls'),
            ) &&
            [...wrapper.querySelectorAll('[data-oj-dropdown-trigger]')].every(
              (trigger) => trigger.hasAttribute('aria-expanded'),
            ) &&
            [...wrapper.querySelectorAll('[data-oj-tooltip]')].every(
              (trigger) => trigger.hasAttribute('aria-describedby'),
            )
          );
        });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );
        });
        await expect(page.locator('.sb-errordisplay')).toBeHidden();
        await expect(page.locator('.sb-nopreview')).toBeHidden();
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        for (const violation of result.violations) {
          findings.push({
            story: currentStory,
            rule: violation.id,
            description: violation.description,
            nodes: violation.nodes.map((node) => ({
              target: node.target,
              summary: node.failureSummary,
            })),
          });
        }
      } catch (error) {
        findings.push({ story: currentStory, error: error.message });
      }
    });
  }
  expect(findings, JSON.stringify(findings, null, 2)).toEqual([]);
});
