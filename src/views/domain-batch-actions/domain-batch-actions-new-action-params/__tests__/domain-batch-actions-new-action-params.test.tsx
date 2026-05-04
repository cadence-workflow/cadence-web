import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainBatchActionsNewActionParams from '../domain-batch-actions-new-action-params';

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

  it('displays the provided description value', () => {
    setup({ description: 'My batch' });

    expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue(
      'My batch'
    );
  });

  it('displays the provided rps value', () => {
    setup({ rps: 50 });

    expect(screen.getByRole('spinbutton', { name: 'RPS' })).toHaveValue(50);
  });

  it('calls onDescriptionChange when description input changes', async () => {
    const { user, onDescriptionChange } = setup({});

    await user.type(
      screen.getByRole('textbox', { name: 'Description' }),
      'test'
    );

    expect(onDescriptionChange).toHaveBeenCalled();
  });

  it('calls onRpsChange when RPS input changes', async () => {
    const { user, onRpsChange } = setup({});

    await user.type(screen.getByRole('spinbutton', { name: 'RPS' }), '200');

    expect(onRpsChange).toHaveBeenCalled();
  });

  it('shows description error when descriptionError is provided', () => {
    setup({ descriptionError: 'Required' });

    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('shows rps error when rpsError is provided', () => {
    setup({ rpsError: 'Must be between 1 and 999' });

    expect(screen.getByText('Must be between 1 and 999')).toBeInTheDocument();
  });
});

function setup({
  description = '',
  rps = 100,
  descriptionError,
  rpsError,
}: {
  description?: string;
  rps?: number;
  descriptionError?: string;
  rpsError?: string;
}) {
  const user = userEvent.setup();
  const onDescriptionChange = jest.fn();
  const onRpsChange = jest.fn();

  render(
    <DomainBatchActionsNewActionParams
      description={description}
      rps={rps}
      onDescriptionChange={onDescriptionChange}
      onRpsChange={onRpsChange}
      descriptionError={descriptionError}
      rpsError={rpsError}
    />
  );

  return { user, onDescriptionChange, onRpsChange };
}
