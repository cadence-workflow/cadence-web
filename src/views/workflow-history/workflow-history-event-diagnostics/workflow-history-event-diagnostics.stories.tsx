import type { Meta, StoryObj } from '@storybook/nextjs';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import { type WorkflowDiagnosticsIssue } from '../workflow-history.types';

import WorkflowHistoryEventDiagnostics from './workflow-history-event-diagnostics';
import { type Props } from './workflow-history-event-diagnostics.types';

const activityFailedIssue: WorkflowDiagnosticsIssue = {
  issueId: 0,
  invariantType: 'Activity Failed',
  reason: 'Activity timed out after 30 seconds',
  metadata: {
    Identity: 'test-worker@test-host',
    ActivityType: 'main.helloWorldActivity',
    ActivityScheduledID: 12,
  },
  runbook:
    'https://cadenceworkflow.io/docs/workflow-troubleshooting/activity-failures/',
  rootCauseType: 'Activity Timeout',
  rootCauseMetadata: { ExpectedTimeout: 30 },
};

const decisionFailedIssue: WorkflowDiagnosticsIssue = {
  issueId: 1,
  invariantType: 'Decision Failed',
  reason: 'Decision task failed with error',
  metadata: {
    identity: '',
    lastFailure: {
      message: 'context deadline exceeded',
      type: 'timeout',
    },
  },
};

function getIssueExpansionId(issue: WorkflowDiagnosticsIssue) {
  return `${issue.invariantType}.${issue.issueId}`;
}

type StoryArgs = Props & {
  expandedIssueIds: Array<string>;
};

const meta = {
  title: 'Views/WorkflowHistory/WorkflowHistoryEventDiagnostics',
  component: WorkflowHistoryEventDiagnostics,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    issues: { control: 'object' },
    expandedIssueIds: { control: 'object' },
    getIsIssueExpanded: { table: { disable: true } },
    toggleIsIssueExpanded: { table: { disable: true } },
  },
  args: {
    issues: [activityFailedIssue, decisionFailedIssue],
    expandedIssueIds: [],
    getIsIssueExpanded: fn(),
    toggleIsIssueExpanded: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render(args: StoryArgs) {
    const [{ expandedIssueIds, issues }, updateArgs] = useArgs<StoryArgs>();

    return (
      <WorkflowHistoryEventDiagnostics
        issues={issues}
        getIsIssueExpanded={(id) => expandedIssueIds.includes(id)}
        toggleIsIssueExpanded={(id) => {
          args.toggleIsIssueExpanded(id);
          updateArgs({
            expandedIssueIds: expandedIssueIds.includes(id)
              ? expandedIssueIds.filter((expandedId) => expandedId !== id)
              : [...expandedIssueIds, id],
          });
        }}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};

export const Expanded: Story = {
  args: {
    expandedIssueIds: [
      getIssueExpansionId(activityFailedIssue),
      getIssueExpansionId(decisionFailedIssue),
    ],
  },
};

export const WithRunbook: Story = {
  args: {
    issues: [activityFailedIssue],
  },
};

export const WithoutRunbook: Story = {
  args: {
    issues: [decisionFailedIssue],
  },
};

export const NoIssues: Story = {
  args: {
    issues: [],
  },
};
