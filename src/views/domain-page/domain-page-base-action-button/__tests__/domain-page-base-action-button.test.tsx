import React from 'react';

import { type IconProps } from 'baseui/icon';

import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainPageBaseActionButton from '../domain-page-base-action-button';
import { type Props } from '../domain-page-base-action-button.types';

function MockIcon({ size }: IconProps) {
  return <span data-testid="mock-icon" data-size={size} />;
}

describe(DomainPageBaseActionButton.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the action label', () => {
    setup({});

    expect(screen.getByText('Start new workflow')).toBeInTheDocument();
  });

  it('renders the action icon at size 20', () => {
    setup({});

    expect(screen.getByTestId('mock-icon')).toHaveAttribute('data-size', '20');
  });

  it('calls onClick when the button is clicked', async () => {
    const { user, onClick } = setup({});

    await user.click(
      screen.getByRole('button', { name: 'Start new workflow' })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabledReason is provided', () => {
    setup({ disabledReason: 'Not authorized to perform this action' });

    expect(
      screen.getByRole('button', {
        name: 'Not authorized to perform this action',
      })
    ).toBeDisabled();
  });

  it('does not call onClick when the button is disabled', async () => {
    const { user, onClick } = setup({
      disabledReason: 'Feature is disabled',
    });

    await user.click(
      screen.getByRole('button', { name: 'Feature is disabled' })
    );

    expect(onClick).not.toHaveBeenCalled();
  });
});

function setup(overrides: Partial<Props> = {}) {
  const onClick = overrides.onClick ?? jest.fn();
  const user = userEvent.setup();

  render(
    <DomainPageBaseActionButton
      label="Start new workflow"
      icon={MockIcon}
      onClick={onClick}
      {...overrides}
    />
  );

  return { user, onClick };
}
