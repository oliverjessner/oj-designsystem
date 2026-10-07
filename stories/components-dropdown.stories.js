import { expect, userEvent, within, waitFor } from 'storybook/test';
import { story, icon } from './helpers.js';

export default { title: 'Components/Dropdown' };
export const Actions = story(
  `<div class="oj-dropdown" data-oj-dropdown><button class="oj-button oj-button-secondary" data-oj-dropdown-trigger>Actions ${icon('chevron-down')}</button><div class="oj-menu" data-oj-dropdown-menu role="menu" hidden><button class="oj-menu-item" role="menuitem" data-oj-value="export">${icon('download')} Export selected</button><button class="oj-menu-item" role="menuitem" data-oj-value="duplicate">${icon('copy')} Duplicate preset</button><button class="oj-menu-item" role="menuitem" disabled>Move to archive</button><hr class="oj-menu-divider" /><button class="oj-menu-item oj-menu-item-danger" role="menuitem" data-oj-value="remove">${icon('trash')} Remove</button></div></div>`,
  'Open with click, Enter, Space or ArrowDown. Use Arrow keys, Home/End, Escape and outside click; disabled actions are skipped.',
);

Actions.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() =>
    expect(canvas.getByRole('button', { name: 'Actions' })).toHaveAttribute(
      'aria-haspopup',
      'menu',
    ),
  );
  const trigger = canvas.getByRole('button', { name: 'Actions' });
  await userEvent.click(trigger);
  await expect(canvas.getByRole('menu')).toBeVisible();
  await userEvent.keyboard('{End}');
  await expect(canvas.getByRole('menuitem', { name: 'Remove' })).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  await expect(trigger).toHaveFocus();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
};
