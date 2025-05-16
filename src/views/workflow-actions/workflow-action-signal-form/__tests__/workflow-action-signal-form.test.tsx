import React from 'react';

import { type FieldErrors, useForm } from 'react-hook-form';

import { render, screen, fireEvent } from '@/test-utils/rtl';

import WorkflowActionSignalForm from '../workflow-action-signal-form';
import { type SignalWorkflowFormData } from '../workflow-action-signal-form.types';

describe('WorkflowActionSignalForm', () => {
  it('renders all form fields correctly', async () => {
    await setup({});

    expect(
      screen.getByPlaceholderText('Enter signal name')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter JSON input')).toBeInTheDocument();
  });

  it('displays error when form has errors', async () => {
    const formErrors = {
      signalName: {
        message: 'Signal name is required',
        type: 'required',
      },
      signalInput: {
        message: 'Invalid JSON format',
        type: 'invalid',
      },
    };

    await setup({ formErrors });

    const signalNameInput = screen.getByPlaceholderText('Enter signal name');
    expect(signalNameInput).toHaveAttribute('aria-invalid', 'true');

    const signalInputTextarea = screen.getByPlaceholderText('Enter JSON input');
    expect(signalInputTextarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles input changes correctly', async () => {
    await setup({});

    const signalNameInput = screen.getByPlaceholderText('Enter signal name');
    fireEvent.change(signalNameInput, { target: { value: 'test-signal' } });
    expect(signalNameInput).toHaveValue('test-signal');

    const signalInputTextarea = screen.getByPlaceholderText('Enter JSON input');
    fireEvent.change(signalInputTextarea, {
      target: { value: '{"key": "value"}' },
    });
    expect(signalInputTextarea).toHaveValue('{"key": "value"}');
  });

  it('renders with default values', async () => {
    await setup({
      formData: {
        signalName: 'test-signal',
        signalInput: '{"key": "value"}',
      },
    });

    const signalNameInput = screen.getByPlaceholderText('Enter signal name');
    expect(signalNameInput).toHaveValue('test-signal');

    const signalInputTextarea = screen.getByPlaceholderText('Enter JSON input');
    expect(signalInputTextarea).toHaveValue('{"key": "value"}');
  });
});

type TestProps = {
  formErrors: FieldErrors<SignalWorkflowFormData>;
  formData: SignalWorkflowFormData;
};

function TestWrapper({ formErrors, formData }: TestProps) {
  const methods = useForm<SignalWorkflowFormData>({
    defaultValues: formData,
  });

  return (
    <WorkflowActionSignalForm
      control={methods.control}
      clearErrors={methods.clearErrors}
      fieldErrors={formErrors}
      formData={formData}
      cluster="test-cluster"
      domain="test-domain"
      workflowId="test-workflow-id"
      runId="test-run-id"
    />
  );
}

async function setup({
  formErrors = {},
  formData = {
    signalName: '',
    signalInput: '',
  },
}: Partial<TestProps>) {
  render(<TestWrapper formErrors={formErrors} formData={formData} />);
}
