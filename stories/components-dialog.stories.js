import { expect, userEvent, within, waitFor } from 'storybook/test';
import { story } from './helpers.js';

export default { title: 'Components/Dialog' };
export const Edit = story(
  `<button class="oj-button oj-button-secondary" data-oj-dialog-open="edit-dialog">Edit project</button><dialog class="oj-dialog" data-oj-dialog id="edit-dialog" aria-labelledby="edit-title"><header class="oj-dialog-header"><h2 class="oj-heading-3" id="edit-title">Edit project</h2></header><div class="oj-dialog-body"><div class="oj-field"><label class="oj-label" for="dialog-project">Project name</label><input class="oj-input" id="dialog-project" value="Article images" autofocus /></div></div><footer class="oj-dialog-footer"><button class="oj-button oj-button-ghost" data-oj-dialog-close="cancel">Cancel</button><button class="oj-button oj-button-primary" data-oj-dialog-close="save">Save</button></footer></dialog>`,
  'Open the native dialog, edit a field, then press Escape or close it. Focus returns to the opener.',
);

Edit.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() =>
    expect(
      canvas.getByRole('button', { name: 'Edit project' }),
    ).toHaveAttribute('aria-haspopup', 'dialog'),
  );
  const opener = canvas.getByRole('button', { name: 'Edit project' });
  await userEvent.click(opener);
  await expect(
    canvas.getByRole('dialog', { name: 'Edit project' }),
  ).toBeVisible();
  await expect(canvas.getByLabelText('Project name')).toHaveFocus();
  await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
  await expect(opener).toHaveFocus();
};
