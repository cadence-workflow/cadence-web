import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import NewBatchActionDetail from '../new-batch-action-detail';

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdDeleteOutline: () => <div>Delete Icon</div>,
}));

describe(NewBatchActionDetail.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the "New batch action" title', () => {
    render(<NewBatchActionDetail onDiscard={jest.fn()} />);

    expect(
      screen.getByRole('heading', { name: 'New batch action' })
    ).toBeInTheDocument();
  });

  it('renders the discard button', () => {
    render(<NewBatchActionDetail onDiscard={jest.fn()} />);

    expect(screen.getByText('Discard batch action')).toBeInTheDocument();
  });

  it('calls onDiscard when the discard button is clicked', async () => {
    const onDiscard = jest.fn();
    const user = userEvent.setup();

    render(<NewBatchActionDetail onDiscard={onDiscard} />);

    await user.click(screen.getByText('Discard batch action'));

    expect(onDiscard).toHaveBeenCalledTimes(1);
  });
});
