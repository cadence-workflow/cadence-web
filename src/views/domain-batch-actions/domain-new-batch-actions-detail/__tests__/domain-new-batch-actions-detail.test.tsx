import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainNewBatchActionDetail from '../domain-new-batch-actions-detail';

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdDeleteOutline: () => <div>Delete Icon</div>,
}));

describe(DomainNewBatchActionDetail.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the "New batch action" title', () => {
    render(<DomainNewBatchActionDetail onDiscard={jest.fn()} />);

    expect(
      screen.getByRole('heading', { name: 'New batch action' })
    ).toBeInTheDocument();
  });

  it('renders the discard button', () => {
    render(<DomainNewBatchActionDetail onDiscard={jest.fn()} />);

    expect(screen.getByText('Discard batch action')).toBeInTheDocument();
  });

  it('calls onDiscard when the discard button is clicked', async () => {
    const onDiscard = jest.fn();
    const user = userEvent.setup();

    render(<DomainNewBatchActionDetail onDiscard={onDiscard} />);

    await user.click(screen.getByText('Discard batch action'));

    expect(onDiscard).toHaveBeenCalledTimes(1);
  });
});
