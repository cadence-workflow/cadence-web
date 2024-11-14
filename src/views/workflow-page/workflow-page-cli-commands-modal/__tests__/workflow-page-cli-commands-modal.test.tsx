import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import workflowPageCliCommandsGroupsConfig from '../../config/workflow-page-cli-commands-groups.config';
import workflowPageCliCommandsConfig from '../../config/workflow-page-cli-commands.config';
import WorkflowPageCliCommandsModal from '../workflow-page-cli-commands-modal';
import {
  type Props,
  type CliCommandConfigs,
  type CliCommandGroupConfigs,
} from '../workflow-page-cli-commands-modal.types';

type AllowedMockGroups = 'mockDomain' | 'mockWorkflow';

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn((props) => (
    <button data-testid="copy-text-button" onClick={() => props.textToCopy}>
      Copy
    </button>
  ))
);

jest.mock(
  '../../config/workflow-page-cli-commands-groups.config',
  () =>
    [
      { name: 'mockDomain', title: 'Domain' },
      { name: 'mockWorkflow', title: 'Workflow' },
    ] as const satisfies CliCommandGroupConfigs<AllowedMockGroups>
);

jest.mock(
  '../../config/workflow-page-cli-commands.config',
  () =>
    [
      {
        label: 'List Domains',
        description: 'Displays a list of all domains',
        command: 'cadence list domains',
        group: 'mockDomain',
      },
      {
        label: 'Create Domain',
        description: 'Creates a new domain with the specified name',
        command: 'cadence create domain',
        group: 'mockDomain',
      },
      {
        label: 'Run workflow',
        command: 'cadence run workflow',
        group: 'mockWorkflow',
      },
    ] as const satisfies CliCommandConfigs<AllowedMockGroups>
);

describe('WorkflowPageCliCommandsModal', () => {
  it('renders the modal with header and footer', () => {
    setup({});
    expect(screen.getByText('CLI commands')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Here are a some useful common CLI commands to get started with Cadence.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const { user, mockedOnclose } = setup({});
    const closeButton = screen.getByText('Close');
    await user.click(closeButton);
    expect(mockedOnclose).toHaveBeenCalled();
  });

  it('renders tabs based on command groups config', () => {
    setup({});
    workflowPageCliCommandsGroupsConfig.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('displays commands based on the selected tab', async () => {
    const { user } = setup({});

    // Simulate selecting a tab
    const newTab = workflowPageCliCommandsGroupsConfig[1];
    await user.click(screen.getByText(newTab.title));

    // Check if the correct commands are shown
    const filteredCommands = workflowPageCliCommandsConfig.filter(
      (cmd) => cmd.group === newTab.name
    );

    filteredCommands.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('updates commands when switching tabs', async () => {
    const { user } = setup({});

    // Simulate selecting a different tab
    const newTab = workflowPageCliCommandsGroupsConfig[1];
    await user.click(screen.getByText(newTab.title));

    // Check if the previous tab's commands are not in the document
    const filteredCommands = workflowPageCliCommandsConfig.filter(
      (cmd) => cmd.group === newTab.name
    );

    // Ensure only commands of the selected group are displayed
    filteredCommands.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders CopyTextButton for each command', () => {
    setup({});
    const initialTabCommands = workflowPageCliCommandsConfig.filter(
      (cmd) => cmd.group === workflowPageCliCommandsGroupsConfig[0].name
    );

    expect(screen.getAllByTestId('copy-text-button').length).toBe(
      initialTabCommands.length
    );
  });
});

function setup({
  isOpen = true,
  onClose = jest.fn(),
}: Partial<Props<AllowedMockGroups>>) {
  const user = userEvent.setup();

  render(<WorkflowPageCliCommandsModal isOpen={isOpen} onClose={onClose} />);

  return { user, mockedOnclose: onClose };
}
