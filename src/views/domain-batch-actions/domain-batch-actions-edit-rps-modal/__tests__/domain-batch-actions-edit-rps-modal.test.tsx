import React from 'react';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import DomainBatchActionsEditRpsModal from '../domain-batch-actions-edit-rps-modal';
import { type Props } from '../domain-batch-actions-edit-rps-modal.types';

describe(DomainBatchActionsEditRpsModal.name, () => {
  it('renders the title and description when open', () => {
    setup({});
    expect(screen.getByText('Edit RPS')).toBeInTheDocument();
    expect(
      screen.getByText(/You can adjust Requests Per Second/)
    ).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    setup({ isOpen: false });
    expect(screen.queryByText('Edit RPS')).not.toBeInTheDocument();
  });

  it('prefills the input with the current rps', () => {
    setup({ currentRps: 250 });
    expect(screen.getByLabelText('RPS')).toHaveValue(250);
  });

  it('disables Save while the value is unchanged', () => {
    setup({ currentRps: 100 });
    expect(screen.getByText('Save RPS').closest('button')).toBeDisabled();
  });

  it('disables Save when the value is invalid', async () => {
    const { user } = setup({ currentRps: 100 });
    const input = screen.getByLabelText('RPS');
    await user.clear(input);
    await user.type(input, '1000');
    await waitFor(() =>
      expect(screen.getByText('Save RPS').closest('button')).toBeDisabled()
    );
  });

  it('calls onSubmit with the parsed number on save', async () => {
    const { user, onSubmit } = setup({ currentRps: 100 });
    const input = screen.getByLabelText('RPS');
    await user.clear(input);
    await user.type(input, '250');
    await user.click(screen.getByText('Save RPS'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(250));
  });

  it('shows an empty field (not 0) when cleared, and disables Save', async () => {
    const { user } = setup({ currentRps: 100 });
    const input = screen.getByLabelText('RPS');
    await user.clear(input);
    expect(input).toHaveValue(null);
    expect(screen.getByText('Save RPS').closest('button')).toBeDisabled();
  });

  it('keeps an in-progress edit when currentRps changes while open', async () => {
    const { user, rerender } = setup({ currentRps: 100 });
    const input = screen.getByLabelText('RPS');
    await user.clear(input);
    await user.type(input, '250');
    rerender(
      <DomainBatchActionsEditRpsModal
        isOpen
        currentRps={500}
        isSubmitting={false}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    expect(screen.getByLabelText('RPS')).toHaveValue(250);
  });

  it('calls onClose when Cancel is clicked', async () => {
    const { user, onClose } = setup({});
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

function setup(props: Partial<Props>) {
  const onSubmit = jest.fn();
  const onClose = jest.fn();
  const user = userEvent.setup();
  const renderResult = render(
    <DomainBatchActionsEditRpsModal
      isOpen
      currentRps={100}
      isSubmitting={false}
      onClose={onClose}
      onSubmit={onSubmit}
      {...props}
    />
  );
  return { user, onSubmit, onClose, ...renderResult };
}
