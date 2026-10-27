import { render, screen, userEvent } from '@/test-utils/rtl';

import MarkdownContextProvider from '../../../markdown-context-provider/markdown-context-provider';
import InputField from '../input-field';
import { type InputFieldProps } from '../input-field.types';

describe(InputField.name, () => {
  it('renders the label and the default value', () => {
    setup({ label: 'Amount', default: 84.5, type: 'number' });

    expect(screen.getByLabelText('Amount')).toHaveValue(84.5);
  });

  it('renders a text input by default', () => {
    setup({ label: 'Note' });

    expect(screen.getByLabelText('Note')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Note')).toHaveValue('');
  });

  it('uses a number input for number fields', () => {
    setup({ label: 'Amount', type: 'number' });

    expect(screen.getByLabelText('Amount')).toHaveAttribute('type', 'number');
  });

  it('uses the field name as the accessible name when there is no label', () => {
    setup({});

    expect(screen.getByRole('textbox', { name: 'note' })).toBeInTheDocument();
  });

  it('shows the placeholder', () => {
    setup({ label: 'Note', placeholder: '0.00' });

    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('updates the value when the user types', async () => {
    const { user } = setup({ label: 'Note' });

    await user.type(screen.getByLabelText('Note'), 'hello');

    expect(screen.getByLabelText('Note')).toHaveValue('hello');
  });

  it('does not reset a typed value when it re-renders', async () => {
    const { user, rerender } = setup({ label: 'Note', default: 'start' });

    const input = screen.getByLabelText('Note');
    await user.clear(input);
    await user.type(input, 'typed');
    rerender(
      <MarkdownContextProvider>
        <InputField name="note" label="Note" default="start" />
      </MarkdownContextProvider>
    );

    expect(screen.getByLabelText('Note')).toHaveValue('typed');
  });
});

function setup(props: Partial<InputFieldProps>) {
  const user = userEvent.setup();
  const result = render(
    <MarkdownContextProvider>
      <InputField name="note" {...props} />
    </MarkdownContextProvider>
  );
  return { user, rerender: result.rerender };
}
