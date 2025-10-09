import React from 'react';

import { get } from 'lodash';
import { useForm } from 'react-hook-form';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowActionStartRetryPolicy from '../workflow-action-start-retry-policy';
import { type Props } from '../workflow-action-start-retry-policy.types';

describe('WorkflowActionStartForm', () => {
  it('displays error when form has errors', async () => {
    const formErrors = {
      retryPolicy: {
        initialIntervalSeconds: {
          message: 'Invalid initial interval',
          type: 'invalid',
        },
        backoffCoefficient: {
          message: 'Invalid backoff coefficient',
          type: 'invalid',
        },
        maximumAttempts: {
          message: 'Invalid maximum attempts',
          type: 'invalid',
        },
        expirationIntervalSeconds: {
          message: 'Invalid expiration interval',
          type: 'invalid',
        },
      },
    };

    const { user } = await setup({
      getFieldErrorMessages: (key) => get(formErrors, key)?.message,
    });

    await user.click(
      screen.getByRole('checkbox', { name: 'Enable Retry Policy' })
    );

    expect(
      screen.getByRole('spinbutton', { name: 'Initial Interval' })
    ).toHaveAttribute('aria-invalid', 'true');

    expect(
      screen.getByRole('spinbutton', { name: 'Backoff Coefficient' })
    ).toHaveAttribute('aria-invalid', 'true');

    expect(
      screen.getByRole('spinbutton', { name: 'Maximum Attempts' })
    ).toHaveAttribute('aria-invalid', 'true');

    await user.click(screen.getByRole('radio', { name: 'Duration' }));
    expect(
      screen.getByRole('spinbutton', { name: 'Expiration Interval' })
    ).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders with default values', async () => {
    await setup({});

    const enableRetryCheckbox = screen.getByRole('checkbox', {
      name: /Enable retry policy/i,
    });
    expect(enableRetryCheckbox).not.toBeChecked();
  });

  it('toggles retry policy fields visibility', async () => {
    const { user } = await setup({});

    // Initially retry policy fields should not be visible
    expect(screen.queryByLabelText('Initial Interval')).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Backoff Coefficient')
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Maximum Interval')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Retries Limit')).not.toBeInTheDocument();

    // Enable retry policy
    const enableRetryCheckbox = screen.getByRole('checkbox', {
      name: /Enable retry policy/i,
    });
    await user.click(enableRetryCheckbox);

    // Now retry policy fields should be visible
    expect(screen.getByLabelText('Initial Interval')).toBeInTheDocument();
    expect(screen.getByLabelText('Backoff Coefficient')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximum Interval')).toBeInTheDocument();
    expect(screen.getByLabelText('Retries Limit')).toBeInTheDocument();
  });

  it('handles non retry limit input fields changes', async () => {
    const { user } = await setup({});

    // Enable retry policy
    const enableRetryCheckbox = screen.getByRole('checkbox', {
      name: /Enable retry policy/i,
    });
    await user.click(enableRetryCheckbox);

    // Should show maximum interval input
    const maxIntervalInput = screen.getByLabelText('Maximum Interval');
    await user.type(maxIntervalInput, '30');
    expect(maxIntervalInput).toHaveValue(30);

    // Should change initial interval
    const initialIntervalInput = screen.getByLabelText('Initial Interval');
    await user.type(initialIntervalInput, '10');
    expect(initialIntervalInput).toHaveValue(10);

    // Should change backoff coefficient
    const backoffCoeffInput = screen.getByLabelText('Backoff Coefficient');
    await user.type(backoffCoeffInput, '2.0');
    expect(backoffCoeffInput).toHaveValue(2.0);
  });

  it('handles retry limit field changes', async () => {
    const { user } = await setup({});

    // Enable retry policy
    await user.click(
      screen.getByRole('checkbox', { name: 'Enable Retry Policy' })
    );

    // Should show attempts field
    expect(screen.getByRole('radio', { name: 'Attempts' })).toBeChecked();
    expect(
      screen.getByRole('spinbutton', { name: 'Maximum Attempts' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('spinbutton', { name: 'Expiration Interval' })
    ).not.toBeInTheDocument();

    // Should show duration field
    await user.click(screen.getByRole('radio', { name: 'Duration' }));
    expect(screen.getByRole('radio', { name: 'Duration' })).toBeChecked();
    expect(
      screen.queryByRole('spinbutton', { name: 'Maximum Attempts' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: 'Expiration Interval' })
    ).toBeInTheDocument();
  });
});

type TestProps = {
  formData: Props['formData'];
  getFieldErrorMessages: Props['getFieldErrorMessages'];
};

function TestWrapper({ formData, getFieldErrorMessages }: TestProps) {
  const methods = useForm<Props['formData']>({
    defaultValues: formData,
  });

  return (
    <WorkflowActionStartRetryPolicy
      control={methods.control}
      clearErrors={methods.clearErrors}
      formData={formData}
      getFieldErrorMessages={getFieldErrorMessages}
    />
  );
}

async function setup({
  formData = {
    taskList: { name: '' },
    workflowType: { name: '' },
    workerSDKLanguage: 'GO',
    executionStartToCloseTimeoutSeconds: 0,
    scheduleType: 'NOW',
    input: [''],

    enableRetryPolicy: false,
    retryPolicy: undefined,
  },
  getFieldErrorMessages = () => undefined,
}: Partial<TestProps>) {
  const user = userEvent.setup();

  render(
    <TestWrapper
      formData={formData}
      getFieldErrorMessages={getFieldErrorMessages}
    />
  );

  return { user };
}
