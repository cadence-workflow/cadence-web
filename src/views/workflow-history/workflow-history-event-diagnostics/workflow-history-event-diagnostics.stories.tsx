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

const longDiagnosticsIssue: WorkflowDiagnosticsIssue = {
  issueId: 42,
  invariantType:
    'Activity Failed After Exhausting All Retry Attempts Across Multiple Task Lists',
  reason:
    'Activity timed out after 30 seconds while polling task list cadence-sys-tl-workers-us-east-1-prod-long-running-batch-processor. Worker identity cadence-worker-7f8a9c2d@ip-10-23-45-67.ec2.internal reported heartbeat lag of 184 seconds before the task was dropped. Subsequent retries (attempt 8 of 8) failed with the same timeout because the activity implementation blocked on a downstream RPC that never returned: https://internal.example.com/services/payments/v2/authorize?merchantId=merch_9f2c1a8b7d6e5f4a3b2c1d0e9f8a7b6c&idempotencyKey=idem_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  metadata: {
    Identity:
      'cadence-worker-7f8a9c2d@ip-10-23-45-67.ec2.internal.really-long-hostname.cluster.internal',
    ActivityType:
      'com.example.payments.batch.LongRunningAuthorizeAndCaptureActivity',
    ActivityScheduledID: 12847,
    TaskList:
      'cadence-sys-tl-workers-us-east-1-prod-long-running-batch-processor',
    lastFailure: {
      message:
        'context deadline exceeded while waiting for downstream authorization; nested cause: rpc error: code = DeadlineExceeded desc = timeout awaiting response from payments-gateway.prod.svc.cluster.local:443 after 30s',
      type: 'timeout',
      stackTrace: Array.from(
        { length: 24 },
        (_, index) =>
          `at com.example.payments.batch.LongRunningAuthorizeAndCaptureActivity.execute(LongRunningAuthorizeAndCaptureActivity.java:${120 + index})`
      ).join('\n'),
      details: {
        attempt: 8,
        maxAttempts: 8,
        heartbeatDetails:
          'processedItems=18429 remainingItems=90210 lastCheckpointId=ckpt_very_long_opaque_token_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    },
  },
  runbook:
    'https://cadenceworkflow.io/docs/workflow-troubleshooting/activity-failures/?utm_source=cadence-web&utm_campaign=diagnostics-runbook-with-an-unreasonably-long-query-string-to-stress-header-wrapping',
  rootCauseType:
    'Downstream RPC Timeout During Activity Heartbeat Window Exceeding Configured ScheduleToClose Timeout',
  rootCauseMetadata: {
    ExpectedTimeout: 30,
    ObservedHeartbeatLagSeconds: 184,
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

export const LongDiagnostics: Story = {
  args: {
    issues: [longDiagnosticsIssue],
    expandedIssueIds: [getIssueExpansionId(longDiagnosticsIssue)],
  },
};

export const NoIssues: Story = {
  args: {
    issues: [],
  },
};
