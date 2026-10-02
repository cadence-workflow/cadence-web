import type { Meta, StoryObj } from '@storybook/nextjs';

import { type EventDetailsEntries } from '../workflow-history-event-details/workflow-history-event-details.types';
import { type WorkflowDiagnosticsIssue } from '../workflow-history.types';

import WorkflowHistoryDetailsRow from './workflow-history-details-row';

const detailsEntries: EventDetailsEntries = [
  {
    key: 'attempt',
    path: 'attempt',
    isGroup: false,
    value: 2,
    renderConfig: null,
  },
  {
    key: 'scheduleToCloseTimeoutSeconds',
    path: 'scheduleToCloseTimeoutSeconds',
    isGroup: false,
    value: 30,
    renderConfig: null,
  },
  {
    key: 'identity',
    path: 'identity',
    isGroup: false,
    value: 'test-worker@test-host',
    renderConfig: null,
  },
  {
    key: 'reason',
    path: 'reason',
    isGroup: false,
    value: 'cadenceInternal:Timeout START_TO_CLOSE',
    isNegative: true,
    renderConfig: null,
  },
];

const diagnosticsIssues: Array<WorkflowDiagnosticsIssue> = [
  {
    issueId: 0,
    invariantType: 'Activity Failed',
    reason: 'Activity timed out after 30 seconds',
    metadata: null,
  },
  {
    issueId: 1,
    invariantType: 'Decision Failed',
    reason: 'Decision task failed with error',
    metadata: null,
  },
];

const meta = {
  title: 'Views/WorkflowHistory/WorkflowHistoryDetailsRow',
  component: WorkflowHistoryDetailsRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    detailsEntries: { control: 'object' },
    diagnosticsIssues: { control: 'object' },
  },
  args: {
    detailsEntries,
    diagnosticsIssues: [],
    cluster: 'testCluster',
    domain: 'testDomain',
    workflowId: 'testWorkflowId',
    runId: 'testRunId',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 800, minHeight: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WorkflowHistoryDetailsRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDiagnosticsIssues: Story = {
  args: {
    diagnosticsIssues,
  },
};

export const WithSingleDiagnosticsIssue: Story = {
  args: {
    diagnosticsIssues: [diagnosticsIssues[0]],
  },
};

export const OnlyDiagnosticsIssues: Story = {
  args: {
    detailsEntries: [],
    diagnosticsIssues,
  },
};
