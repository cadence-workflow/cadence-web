import type { Meta, StoryObj } from '@storybook/nextjs';

import { type WorkflowDiagnosticsIssue } from '../workflow-history.types';

import WorkflowHistoryDetailsRowDiagnosticsTooltip from './workflow-history-details-row-diagnostics-tooltip';

const activityFailedIssue: WorkflowDiagnosticsIssue = {
  issueId: 0,
  invariantType: 'Activity Failed',
  reason: 'Activity timed out after 30 seconds',
  metadata: null,
};

const decisionFailedIssue: WorkflowDiagnosticsIssue = {
  issueId: 1,
  invariantType: 'Decision Failed',
  reason: 'Decision task failed with error',
  metadata: null,
};

const longIssue: WorkflowDiagnosticsIssue = {
  issueId: 2,
  invariantType:
    'Activity Failed After Exhausting All Retry Attempts Across Multiple Task Lists',
  reason:
    'Activity timed out after 30 seconds while polling task list cadence-sys-tl-workers-us-east-1-prod-long-running-batch-processor. Subsequent retries (attempt 8 of 8) failed with the same timeout.',
  metadata: null,
};

const meta = {
  title: 'Views/WorkflowHistory/WorkflowHistoryDetailsRowDiagnosticsTooltip',
  component: WorkflowHistoryDetailsRowDiagnosticsTooltip,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'object' },
  },
  args: {
    label: 'Diagnostics issues',
    value: [activityFailedIssue, decisionFailedIssue],
    cluster: 'testCluster',
    domain: 'testDomain',
    workflowId: 'testWorkflowId',
    runId: 'testRunId',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WorkflowHistoryDetailsRowDiagnosticsTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleIssue: Story = {
  args: {
    value: [activityFailedIssue],
  },
};

export const LongIssue: Story = {
  args: {
    value: [activityFailedIssue, longIssue],
  },
};
