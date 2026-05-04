import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import LabelWithTooltip from '../label-with-tooltip';

describe(LabelWithTooltip.name, () => {
  it('renders the label text', () => {
    setup({ label: 'Description' });

    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('does not render tooltip icon when tooltip is not provided', () => {
    setup({ label: 'Description' });

    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });

  it('renders tooltip icon when tooltip is provided', () => {
    setup({ label: 'RPS', tooltip: 'Requests per second' });

    expect(screen.getByText('RPS')).toBeInTheDocument();
    expect(
      screen.getByText('RPS').parentElement?.querySelectorAll('svg').length
    ).toBe(1);
  });

  it('shows tooltip content on hover', async () => {
    const { user } = setup({
      label: 'RPS',
      tooltip: 'Requests per second',
    });

    const iconWrapper = screen
      .getByText('RPS')
      .parentElement?.querySelector('svg')?.parentElement;

    if (iconWrapper) {
      await user.hover(iconWrapper);
    }

    expect(await screen.findByText('Requests per second')).toBeInTheDocument();
  });
});

function setup(props: { label: string; tooltip?: string }) {
  const user = userEvent.setup();
  render(<LabelWithTooltip {...props} />);
  return { user };
}
