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

let mockParams: Record<string, string> = {
  domain: 'test-domain',
  cluster: 'test-cluster',
  workflowId: 'test-workflow-id',
  runId: 'test-run-id',
};

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => mockParams,
}));

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
        command: 'cadence --domain {domain-name} list domains',
        group: 'mockDomain',
      },
      {
        label: 'Create Domain',
        description: 'Creates a new domain with the specified name',
        command: 'cadence --domain {domain-name} create domain',
        group: 'mockDomain',
      },
      {
        label: 'Run workflow',
        command:
          'cadence --domain {domain-name} workflow run -w {workflow-id} -r {run-id}',
        group: 'mockWorkflow',
      },
    ] as const satisfies CliCommandConfigs<AllowedMockGroups>
);

describe('WorkflowPageCliCommandsModal', () => {
  beforeEach(() => {
    mockParams = {
      domain: 'test-domain',
      cluster: 'test-cluster',
      workflowId: 'test-workflow-id',
      runId: 'test-run-id',
    };
  });

  it('renders the modal with header and footer', () => {
    setup({});
    expect(screen.getByText('CLI commands')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Here are some useful common CLI commands to get started with Cadence.'
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

  it('displays only commands for the selected tab', async () => {
    const { user } = setup({});

    const previousTab = workflowPageCliCommandsGroupsConfig[0];
    const newTab = workflowPageCliCommandsGroupsConfig[1];

    const newTabCommands = workflowPageCliCommandsConfig.filter(
      (cmd) => cmd.group === newTab.name
    );
    const previousTabCommands = workflowPageCliCommandsConfig.filter(
      (cmd) => cmd.group === previousTab.name
    );

    // Before clicking: previous tab commands shown, new tab commands not shown
    previousTabCommands.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    newTabCommands.forEach(({ label }) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });

    await user.click(screen.getByText(newTab.title));

    // After clicking: new tab commands shown, previous tab commands not shown
    newTabCommands.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    previousTabCommands.forEach(({ label }) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
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

  it('substitutes all params including workflow and run IDs', async () => {
    const { user } = setup({});

    // Switch to the workflow tab
    const workflowTab = workflowPageCliCommandsGroupsConfig[1];
    await user.click(screen.getByText(workflowTab.title));

    expect(
      screen.getByText((_content, element) => {
        return (
          element?.textContent ===
          'cadence --domain test-domain workflow run -w test-workflow-id -r test-run-id'
        );
      })
    ).toBeInTheDocument();
  });

  it('decodes URL-encoded params before substituting', () => {
    mockParams = {
      domain: 'test%20domain',
      cluster: 'test-cluster',
      workflowId: 'workflow%2Fid',
      runId: 'run%3Aid',
    };
    setup({});

    expect(
      screen.getByText((_content, element) => {
        return (
          element?.textContent === 'cadence --domain test domain list domains'
        );
      })
    ).toBeInTheDocument();
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
