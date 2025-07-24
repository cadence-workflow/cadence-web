import { type z } from 'zod';

import type workflowDiagnosticsResultSchema from '../schemas/workflow-diagnostics-result-schema';

export const mockDiagnosticsQueryResult = {
  DiagnosticsResult: {
    Timeouts: null,
    Failures: {
      Issues: [
        {
          IssueID: 0,
          InvariantType: 'Activity Failed',
          Reason:
            'The failure is because of an error returned from the service code',
          Metadata: {
            Identity: 'test-worker@test-host@test-domain@test-workflow@12345',
            ActivityType: 'main.helloWorldActivity',
            ActivityScheduledID: 43,
            ActivityStartedID: 156,
          },
        },
        {
          IssueID: 1,
          InvariantType: 'Activity Failed',
          Reason:
            'The failure is because of an error returned from the service code',
          Metadata: {
            Identity: 'test-worker@test-host@test-domain@test-workflow@12345',
            ActivityType: 'main.helloWorldActivity',
            ActivityScheduledID: 29,
            ActivityStartedID: 234,
          },
        },
        {
          IssueID: 2,
          InvariantType: 'Activity Failed',
          Reason:
            'The failure is because of an error returned from the service code',
          Metadata: {
            Identity: 'test-worker@test-host@test-domain@test-workflow@12345',
            ActivityType: 'main.helloWorldActivity',
            ActivityScheduledID: 82,
            ActivityStartedID: 234,
          },
        },
        {
          IssueID: 3,
          InvariantType: 'Activity Failed',
          Reason:
            'The failure is because of an error returned from the service code',
          Metadata: {
            Identity: 'test-worker@test-host@test-domain@test-workflow@12345',
            ActivityType: 'main.helloWorldActivity',
            ActivityScheduledID: 102,
            ActivityStartedID: 411,
          },
        },
        {
          IssueID: 4,
          InvariantType: 'Workflow Failed',
          Reason:
            'The failure is because of an error returned from the service code',
          Metadata: {
            Identity: 'test-worker@test-host@test-domain@test-workflow@12345',
            ActivityType: '',
            ActivityScheduledID: 0,
            ActivityStartedID: 0,
          },
        },
      ],
      RootCause: [
        {
          IssueID: 0,
          RootCauseType:
            'There is an issue in the worker service that is causing a failure. Check identity for service logs',
          Metadata: null,
        },
        {
          IssueID: 1,
          RootCauseType:
            'There is an issue in the worker service that is causing a failure. Check identity for service logs',
          Metadata: null,
        },
        {
          IssueID: 2,
          RootCauseType:
            'There is an issue in the worker service that is causing a failure. Check identity for service logs',
          Metadata: null,
        },
        {
          IssueID: 3,
          RootCauseType:
            'There is an issue in the worker service that is causing a failure. Check identity for service logs',
          Metadata: null,
        },
        {
          IssueID: 4,
          RootCauseType:
            'There is an issue in the worker service that is causing a failure. Check identity for service logs',
          Metadata: null,
        },
      ],
      Runbooks: [
        'https://cadenceworkflow.io/docs/workflow-troubleshooting/activity-failures/',
      ],
    },
    Retries: null,
  },
  DiagnosticsCompleted: true,
} as const satisfies z.input<typeof workflowDiagnosticsResultSchema>;
