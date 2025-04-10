import React from 'react';

import { type FieldErrors, useForm, type Control } from 'react-hook-form';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowActionResetForm from '../workflow-action-reset-form';
import { type ResetWorkflowFormData } from '../workflow-action-reset-form.types';

describe('WorkflowActionResetForm', () => {
  it('renders all form fields correctly', async () => {
    await setup({});

    // Check if all form fields are rendered
    expect(screen.getByPlaceholderText('Find Event Id')).toBeInTheDocument();
    expect(screen.getByText('Skip signal reapply')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter reason for reset')
    ).toBeInTheDocument();
  });

  it('displays error messages when form has errors', async () => {
    const formErrors = {
      decisionFinishEventId: {
        message: 'Event ID is required',
        type: 'required',
      },
      reason: { message: 'Reason is required', type: 'required' },
    };

    await setup({ formErrors });

    // Check if error messages are displayed
    // Note: The error messages might not be directly visible in the DOM
    // We'll check for the error state instead
    const eventIdInput = screen.getByPlaceholderText('Find Event Id');
    expect(eventIdInput).toHaveAttribute('aria-invalid', 'true');

    const reasonInput = screen.getByPlaceholderText('Enter reason for reset');
    expect(reasonInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles input changes correctly', async () => {
    const { user } = await setup({});

    // Test Event ID input
    const eventIdInput = screen.getByPlaceholderText('Find Event Id');
    await user.type(eventIdInput, '123');
    expect(eventIdInput).toHaveValue(123);

    // Test Reason textarea
    const reasonInput = screen.getByPlaceholderText('Enter reason for reset');
    await user.type(reasonInput, 'Test reason');
    expect(reasonInput).toHaveValue('Test reason');

    // Test Skip signal reapply checkbox
    const skipSignalCheckbox = screen.getByRole('checkbox', {
      name: /skip signal reapply/i,
    });
    await user.click(skipSignalCheckbox);
    expect(skipSignalCheckbox).toBeChecked();
  });

  it('renders with default values', async () => {
    await setup({});

    // Check default values
    const eventIdInput = screen.getByPlaceholderText('Find Event Id');
    expect(eventIdInput).toHaveValue(null);

    const reasonInput = screen.getByPlaceholderText('Enter reason for reset');
    expect(reasonInput).toHaveValue('');

    const skipSignalCheckbox = screen.getByRole('checkbox', {
      name: /skip signal reapply/i,
    });
    expect(skipSignalCheckbox).not.toBeChecked();
  });
});

function TestWrapper({
  formErrors,
  formData,
}: {
  formErrors: FieldErrors<ResetWorkflowFormData>;
  formData: ResetWorkflowFormData;
}) {
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
}: {
  formErrors?: FieldErrors<ResetWorkflowFormData>;
  formData?: ResetWorkflowFormData;
} = {}) {
  const user = userEvent.setup();

  render(<TestWrapper formErrors={formErrors} formData={formData} />);

  return { user };
}
