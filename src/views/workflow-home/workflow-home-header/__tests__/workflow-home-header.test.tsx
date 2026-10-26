import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHomeHeader from '../workflow-home-header';
import { type Props } from '../workflow-home-header.types';

describe(WorkflowHomeHeader.name, () => {
  it('renders the Refresh button', () => {
    setup({});
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('renders the title as a heading', () => {
    setup({ title: 'Expense report 1' });
    expect(
      screen.getByRole('heading', { level: 1, name: 'Expense report 1' })
    ).toBeInTheDocument();
  });

  it('renders no heading without a title', () => {
    setup({});
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('calls onRefresh when Refresh is clicked', async () => {
    const { user, onRefresh } = setup({});
    await user.click(screen.getByText('Refresh'));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});

function setup(props: Partial<Props>) {
  const user = userEvent.setup();
  const onRefresh = jest.fn();
  render(
    <WorkflowHomeHeader onRefresh={onRefresh} isRefreshing={false} {...props} />
  );
  return { user, onRefresh };
}
