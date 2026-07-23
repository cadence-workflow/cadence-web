import React from 'react';

import { useForm } from 'react-hook-form';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type RetryPolicyFormFields } from '@/views/shared/retry-policy-fields/schemas/retry-policy-form-schema';

import RetryPolicyFields from '../retry-policy-fields';
import { type Props } from '../retry-policy-fields.types';

describe(RetryPolicyFields.name, () => {
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
      fieldErrors: formErrors,
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

    expect(screen.queryByLabelText('Initial Interval')).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Backoff Coefficient')
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Maximum Interval')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Retries Limit')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('checkbox', { name: /Enable retry policy/i })
    );

    expect(screen.getByLabelText('Initial Interval')).toBeInTheDocument();
    expect(screen.getByLabelText('Backoff Coefficient')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximum Interval')).toBeInTheDocument();
    expect(screen.getByLabelText('Retries Limit')).toBeInTheDocument();
  });

  it('handles non retry limit input fields changes', async () => {
    const { user } = await setup({});

    await user.click(
      screen.getByRole('checkbox', { name: /Enable retry policy/i })
    );

    const maxIntervalInput = screen.getByLabelText('Maximum Interval');
    await user.type(maxIntervalInput, '30');
    expect(maxIntervalInput).toHaveValue(30);

    const initialIntervalInput = screen.getByLabelText('Initial Interval');
    await user.type(initialIntervalInput, '10');
    expect(initialIntervalInput).toHaveValue(10);

    const backoffCoeffInput = screen.getByLabelText('Backoff Coefficient');
    await user.type(backoffCoeffInput, '2.0');
    expect(backoffCoeffInput).toHaveValue(2);
  });

  it('handles retry limit field changes', async () => {
    const { user } = await setup({});

    await user.click(
      screen.getByRole('checkbox', { name: 'Enable Retry Policy' })
    );

    expect(screen.getByRole('radio', { name: 'Attempts' })).toBeChecked();
    expect(
      screen.getByRole('spinbutton', { name: 'Maximum Attempts' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('spinbutton', { name: 'Expiration Interval' })
    ).not.toBeInTheDocument();

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
  fieldErrors: Props<RetryPolicyFormFields>['fieldErrors'];
  variant?: Props<RetryPolicyFormFields>['variant'];
};

function TestWrapper({ fieldErrors, variant = 'compact' }: TestProps) {
  const methods = useForm<RetryPolicyFormFields>({
    defaultValues: {
      enableRetryPolicy: false,
      limitRetries: 'ATTEMPTS',
    },
  });

  return (
    <RetryPolicyFields
      control={methods.control}
      clearErrors={methods.clearErrors}
      fieldErrors={fieldErrors}
      variant={variant}
    />
  );
}

async function setup({
  fieldErrors = {},
  variant = 'compact',
}: Partial<TestProps> = {}) {
  const user = userEvent.setup();

  render(<TestWrapper fieldErrors={fieldErrors} variant={variant} />);

  return { user };
}
