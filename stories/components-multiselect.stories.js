import { expect, userEvent, within } from 'storybook/test';
import { createMultiselect } from 'oj-designsystem';
import { story } from './helpers.js';

export default { title: 'Components/Multiselect' };
const options = [
  { value: 'research', label: 'Research' },
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'archived', label: 'Archived', disabled: true },
];

function example(config = {}, description = '', editable = false) {
  return story(
    '<div class="oj-stack" style="max-inline-size:24rem"></div>',
    description,
    (root) => {
      const content = root.querySelector('.oj-stack');
      const picker = createMultiselect({ label: 'Topics', options, ...config });
      const output = document.createElement('output');
      output.className = 'oj-helper';
      const showValue = () => {
        output.textContent = `Value: ${picker.value().join(', ') || 'none'}`;
      };
      picker.node.addEventListener('oj:change', showValue);
      content.append(picker.node, output);
      showValue();
      if (editable) {
        const button = document.createElement('button');
        button.className = 'oj-button oj-button-secondary';
        button.type = 'button';
        button.textContent = 'Load other options';
        button.addEventListener('click', () => {
          picker.setOptions(
            [
              { value: 'design', label: 'Design' },
              { value: 'writing', label: 'Writing' },
            ],
            { emit: true },
          );
          picker.setValue(['writing'], { emit: true });
        });
        content.append(button);
      }
      return () => {
        picker.node.removeEventListener('oj:change', showValue);
        picker.dispose();
      };
    },
  );
}

export const SearchAndSelect = example(
  {},
  'Search without losing selections. Native checkboxes stay open for multiple choices; Escape returns focus and Tab leaves naturally.',
);
SearchAndSelect.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const trigger = canvas.getByRole('button', { name: 'Topics Select options' });
  await userEvent.click(trigger);
  await expect(canvas.getByRole('searchbox')).toHaveFocus();
  await userEvent.click(canvas.getByRole('checkbox', { name: 'Research' }));
  await userEvent.click(canvas.getByRole('checkbox', { name: 'Design' }));
  await expect(trigger).toHaveTextContent('2 selected');
  await userEvent.type(canvas.getByRole('searchbox'), 'missing');
  await expect(canvas.getByText('No options found.')).toBeVisible();
  await userEvent.click(
    canvas.getByRole('button', { name: 'Reset selection' }),
  );
  await expect(trigger).toHaveTextContent('Select options');
  await userEvent.keyboard('{Escape}');
  await expect(trigger).toHaveFocus();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
};

export const SelectedAndDynamic = example(
  { value: ['research', 'design'] },
  'setOptions() preserves known values; setValue() updates selection. Both can explicitly emit oj:change.',
  true,
);
export const Localized = example(
  {
    label: 'Themen',
    description: 'Wähle beliebig viele Themen aus.',
    value: ['design'],
    options: [
      ...options,
      {
        value: 'long',
        label:
          'Ein langer Eintrag, der auch in schmalen Ansichten vollständig lesbar bleibt',
      },
    ],
    labels: {
      placeholder: 'Themen auswählen',
      search: 'Themen suchen',
      searchPlaceholder: 'Thema finden',
      reset: 'Auswahl zurücksetzen',
      empty: 'Keine Optionen verfügbar.',
      noResults: 'Keine Optionen gefunden.',
    },
    formatSelection: (selected) =>
      selected.length === 0
        ? 'Themen auswählen'
        : selected.length === 1
          ? selected[0].label
          : `${selected.length} ausgewählt`,
  },
  'All visible text is configurable and rendered literally. The panel uses the visual viewport and flips above its trigger when needed.',
);
export const Empty = example(
  { options: [] },
  'Empty lists remain inspectable and announce their state; search and reset are disabled.',
);
export const Disabled = example(
  { disabled: true, value: ['design'] },
  'A disabled component keeps its selection visible and uses native disabled controls.',
);
