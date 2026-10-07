import { expect, userEvent, within, waitFor } from 'storybook/test';
import { story } from './helpers.js';

export default { title: 'Components/Tabs' };
export const Navigation = story(
  `<div class="oj-tabs" data-oj-tabs><div class="oj-tab-list" role="tablist" aria-label="Project sections"><button class="oj-tab" role="tab" aria-selected="true" aria-controls="overview-panel">Overview</button><button class="oj-tab" role="tab" aria-selected="false" aria-controls="items-panel">Items</button><button class="oj-tab" role="tab" aria-selected="false" aria-controls="history-panel">History</button><button class="oj-tab" role="tab" aria-selected="false" aria-controls="unavailable-panel" disabled>Unavailable</button></div><section class="oj-tab-panel oj-panel" role="tabpanel" id="overview-panel"><h2 class="oj-heading-3">Overview</h2><p>24 files are ready for review.</p></section><section class="oj-tab-panel oj-panel" role="tabpanel" id="items-panel"><h2 class="oj-heading-3">Items</h2><p>Browse the current import batch.</p></section><section class="oj-tab-panel oj-panel" role="tabpanel" id="history-panel"><h2 class="oj-heading-3">History</h2><p>Completed exports stay in this application.</p></section><section class="oj-tab-panel" role="tabpanel" id="unavailable-panel">This panel is unavailable.</section></div>`,
  'Click a tab or use ArrowRight/ArrowLeft, Home and End. Disabled tabs are skipped; JavaScript owns panel visibility.',
);

Navigation.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() => expect(canvas.getAllByRole('tabpanel')).toHaveLength(1));
  const tabs = canvas.getAllByRole('tab');
  await userEvent.click(tabs[0]);
  await userEvent.keyboard('{ArrowRight}');
  await expect(tabs[1]).toHaveFocus();
  await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  await expect(canvas.getByRole('tabpanel')).toHaveTextContent(
    'Browse the current import batch.',
  );
  await userEvent.keyboard('{End}');
  await expect(tabs[2]).toHaveFocus();
};
