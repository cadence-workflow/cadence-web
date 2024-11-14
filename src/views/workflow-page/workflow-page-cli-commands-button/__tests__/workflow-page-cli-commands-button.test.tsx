import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowPageCliCommandsButton from '../workflow-page-cli-commands-button';

jest.mock(
  '../../workflow-page-cli-commands-modal/workflow-page-cli-commands-modal',
  () =>
    jest.fn((props) => {
      return props.isOpen ? (
        <div data-testid="cli-commands-modal">CLI Commands Modal</div>
      ) : null;
    })
);

describe('WorkflowPageCliCommandsButton', () => {
  it('renders the button with the correct text', () => {
    setup();
    expect(
      screen.getByRole('button', { name: 'CLI commands' })
    ).toBeInTheDocument();
  });

  it('does not render the modal initially', () => {
    setup();
    expect(screen.queryByTestId('cli-commands-modal')).not.toBeInTheDocument();
  });

  it('opens the modal when the button is clicked', async () => {
    const { user } = setup();
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByTestId('cli-commands-modal')).toBeInTheDocument();
  });

  it('toggles the modal on multiple button clicks', async () => {
    const { user } = setup();
    const button = screen.getByRole('button');

    // Open modal
    await user.click(button);
    expect(screen.getByTestId('cli-commands-modal')).toBeInTheDocument();

    // Close modal
    await user.click(button);
    expect(screen.queryByTestId('cli-commands-modal')).not.toBeInTheDocument();
  });
});

function setup() {
  const user = userEvent.setup();

  render(<WorkflowPageCliCommandsButton />);

  return { user };
}
