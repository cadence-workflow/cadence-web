import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { type FieldErrors, useForm } from 'react-hook-form';

import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainBatchActionsNewActionParams from '../domain-batch-actions-new-action-params';
import batchActionParamsSchema, {
  type BatchActionParamsFormData,
} from '../schemas/batch-action-params-schema';

describe(DomainBatchActionsNewActionParams.name, () => {
  it('renders description input with label', () => {
    setup({});

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Description' })
    ).toBeInTheDocument();
  });

  it('renders RPS input with label', () => {
    setup({});

    expect(screen.getByText('RPS')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'RPS' })).toBeInTheDocument();
  });

  it('displays the default rps value', () => {
    setup({});

    expect(screen.getByRole('spinbutton', { name: 'RPS' })).toHaveValue(100);
  });

  it('shows description error when provided', () => {
    setup({
      fieldErrors: {
        description: { type: 'too_small', message: 'Description is required' },
      },
    });

    expect(screen.getByText('Description is required')).toBeInTheDocument();
  });

  it('shows rps error when provided', () => {
    setup({
      fieldErrors: {
        rps: { type: 'too_small', message: 'Must be between 1 and 999' },
      },
    });

    expect(screen.getByText('Must be between 1 and 999')).toBeInTheDocument();
  });
});

function Wrapper({
  fieldErrors,
}: {
  fieldErrors?: FieldErrors<BatchActionParamsFormData>;
}) {
  const { control } = useForm<BatchActionParamsFormData>({
    resolver: zodResolver(batchActionParamsSchema),
    defaultValues: { description: '', rps: 100 },
    mode: 'onChange',
  });

  return (
    <DomainBatchActionsNewActionParams
      control={control}
      fieldErrors={fieldErrors ?? {}}
    />
  );
}

function setup({
  fieldErrors,
}: {
  fieldErrors?: FieldErrors<BatchActionParamsFormData>;
}) {
  const user = userEvent.setup();

  render(<Wrapper fieldErrors={fieldErrors} />);

  return { user };
}
