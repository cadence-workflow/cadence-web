import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import workflowPageCliCommandsConfig from '../../config/workflow-page-cli-commands.config';
import WorkflowPageCliCommandsModal from '../workflow-page-cli-commands-modal';

let mockParams: Record<string, string> = {};

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => mockParams,
}));

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(() => <button>Copy</button>)
);

const domainCommand = workflowPageCliCommandsConfig.find(
  ({ group }) => group === 'domain'
);
const workflowCommand = workflowPageCliCommandsConfig.find(
  ({ group }) => group === 'workflow'
);

describe('WorkflowPageCliCommandsModal default tab', () => {
  it('opens on the Workflow tab when opened from a workflow page', () => {
    mockParams = {
      domain: 'test-domain',
      cluster: 'test-cluster',
      workflowId: 'test-workflow-id',
      runId: 'test-run-id',
    };
    render(<WorkflowPageCliCommandsModal isOpen onClose={jest.fn()} />);

    expect(screen.getByRole('tab', { name: 'Workflow' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByText(workflowCommand!.label)).toBeInTheDocument();
    expect(screen.queryByText(domainCommand!.label)).not.toBeInTheDocument();
  });

  it('opens on the Domain tab when there is no workflow in the route', () => {
    mockParams = { domain: 'test-domain', cluster: 'test-cluster' };
    render(<WorkflowPageCliCommandsModal isOpen onClose={jest.fn()} />);

    expect(screen.getByRole('tab', { name: 'Domain' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByText(domainCommand!.label)).toBeInTheDocument();
    expect(screen.queryByText(workflowCommand!.label)).not.toBeInTheDocument();
  });
});
