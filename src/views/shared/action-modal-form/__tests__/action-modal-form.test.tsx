import { z } from 'zod';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import ActionModalForm from '../action-modal-form';

const schema = z.object({
  reason: z.string().trim().min(1, 'Reason is required'),
});

describe(ActionModalForm.name, () => {
  it('validates fields and submits the parsed form data', async () => {
    const { user, onSubmit, onConfirm } = setup({ withForm: true });

    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Reason is required'
    );
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText('Reason'), '  keep this reason  ');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { reason: 'keep this reason' },
        expect.anything()
      );
    });
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('confirms without requiring form values or calling the form submit callback', async () => {
    const { user, onSubmit, onConfirm } = setup({ withForm: false });

    expect(screen.queryByLabelText('Reason')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('supports keyboard confirmation without a form schema', async () => {
    const { user, onConfirm } = setup({ withForm: false });

    screen.getByRole('button', { name: 'Confirm' }).focus();
    await user.keyboard('{Enter}');

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});

function setup({ withForm }: { withForm: boolean }) {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  const onConfirm = jest.fn();

  render(
    <ActionModalForm<{ reason: string }>
      schema={withForm ? schema : undefined}
      initialFormValues={withForm ? { reason: '' } : undefined}
      onSubmit={onSubmit}
      onConfirm={onConfirm}
    >
      {(form) => (
        <>
          {form && (
            <>
              <input aria-label="Reason" {...form.register('reason')} />
              {form.formState.errors.reason?.message && (
                <span role="alert">{form.formState.errors.reason.message}</span>
              )}
            </>
          )}
          <button type="submit">{form ? 'Submit' : 'Confirm'}</button>
        </>
      )}
    </ActionModalForm>
  );

  return { user, onSubmit, onConfirm };
}
