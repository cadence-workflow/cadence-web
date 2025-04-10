import React from 'react';

import { type FieldErrors, useForm, type Control } from 'react-hook-form';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowActionResetForm from '../workflow-action-reset-form';
import { type ResetWorkflowFormData } from '../workflow-action-reset-form.types';

describe('WorkflowActionResetForm', () => {
  it('renders all form fields correctly', async () => {
    await setup({});

    expect(screen.getByPlaceholderText('Find Event ID')).toBeInTheDocument();
    expect(screen.getByText('Skip signal re-apply')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter reason for reset')
    ).toBeInTheDocument();
  });

  it('displays error when form has errors', async () => {
    const formErrors = {
      decisionFinishEventId: {
        message: 'Event ID is required',
        type: 'required',
      },
      reason: { message: 'Reason is required', type: 'required' },
    };

    await setup({ formErrors });

    const eventIdInput = screen.getByPlaceholderText('Find Event ID');
    expect(eventIdInput).toHaveAttribute('aria-invalid', 'true');

    const reasonInput = screen.getByPlaceholderText('Enter reason for reset');
    expect(reasonInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles input changes correctly', async () => {
    const { user } = await setup({});

    const eventIdInput = screen.getByPlaceholderText('Find Event ID');
    await user.type(eventIdInput, '123');
    expect(eventIdInput).toHaveValue(123);

    const reasonInput = screen.getByPlaceholderText('Enter reason for reset');
    await user.type(reasonInput, 'Test reason');
    expect(reasonInput).toHaveValue('Test reason');

    const skipSignalCheckbox = screen.getByRole('checkbox', {
      name: /skip signal re-apply/i,
    });
    await user.click(skipSignalCheckbox);
    expect(skipSignalCheckbox).toBeChecked();
  });

  it('renders with default values', async () => {
    await setup({});

    const eventIdInput = screen.getByPlaceholderText('Find Event ID');
    expect(eventIdInput).toHaveValue(null);

    const reasonInput = screen.getByPlaceholderText('Enter reason for reset');
    expect(reasonInput).toHaveValue('');

    const skipSignalCheckbox = screen.getByRole('checkbox', {
      name: /skip signal re-apply/i,
    });
    expect(skipSignalCheckbox).not.toBeChecked();
  });
});

type TestProps = {
  formErrors: FieldErrors<ResetWorkflowFormData>;
  formData: ResetWorkflowFormData;
};

function TestWrapper({ formErrors, formData }: TestProps) {
  const methods = useForm<ResetWorkflowFormData>({
    defaultValues: formData,
  });

  return (
    <WorkflowActionResetForm
      control={methods.control as Control<ResetWorkflowFormData>}
      fieldErrors={formErrors}
      formData={formData}
    />
  );
}

async function setup({
  formErrors = {},
  formData = {
    decisionFinishEventId: '',
    reason: '',
    skipSignalReapply: false,
  },
}: Partial<TestProps>) {
  const user = userEvent.setup();

  render(<TestWrapper formErrors={formErrors} formData={formData} />);

  return { user };
}
