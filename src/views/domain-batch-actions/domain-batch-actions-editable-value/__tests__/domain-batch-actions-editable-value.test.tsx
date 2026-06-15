import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainBatchActionEditableValue from '../domain-batch-actions-editable-value';
import { type Props } from '../domain-batch-actions-editable-value.types';

describe(DomainBatchActionEditableValue.name, () => {
  it('renders the value', () => {
    setup({ value: 200 });
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('renders a dash when value is undefined', () => {
    setup({ value: undefined });
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('does not render the Edit button when not editable', () => {
    setup({ value: 200, editable: false });
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('renders the Edit button when editable', () => {
    setup({ value: 200, editable: true });
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('calls onEdit when the Edit button is clicked', async () => {
    const { user, onEdit } = setup({ value: 200, editable: true });
    await user.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});

function setup(props: Partial<Props>) {
  const onEdit = jest.fn();
  const user = userEvent.setup();
  render(
    <DomainBatchActionEditableValue
      value={undefined}
      onEdit={onEdit}
      {...props}
    />
  );
  return { user, onEdit };
}
