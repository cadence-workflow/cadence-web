import { type WorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';

import getCanonicalEventIdFromIssueMetadata from '../get-canonical-event-id-from-issue-metadata';
import getDiagnosticsIssuesByEventId from '../get-diagnostics-issues-by-event-id';

jest.mock('../get-canonical-event-id-from-issue-metadata');

const mockedGetCanonicalEventIdFromIssueMetadata =
  getCanonicalEventIdFromIssueMetadata as jest.MockedFunction<
    typeof getCanonicalEventIdFromIssueMetadata
  >;

describe(getDiagnosticsIssuesByEventId.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('groups issues by canonical event ID returned by helper', () => {
    mockedGetCanonicalEventIdFromIssueMetadata
      .mockReturnValueOnce('100')
      .mockReturnValueOnce('200');

    const { result } = setup({
      diagnosticsResult: createDiagnosticsResult({
        issues: [
          createIssue({ issueId: 0, metadata: { ActivityScheduledID: 1 } }),
          createIssue({ issueId: 1, metadata: { ActivityScheduledID: 2 } }),
        ],
      }),
    });

    expect(Object.keys(result).sort()).toEqual(['100', '200']);
    expect(result['100']).toHaveLength(1);
    expect(result['100'][0].issueId).toBe(0);
    expect(result['200']).toHaveLength(1);
    expect(result['200'][0].issueId).toBe(1);
    expect(mockedGetCanonicalEventIdFromIssueMetadata).toHaveBeenCalledTimes(2);
    expect(mockedGetCanonicalEventIdFromIssueMetadata).toHaveBeenNthCalledWith(
      1,
      { ActivityScheduledID: 1 }
    );
    expect(mockedGetCanonicalEventIdFromIssueMetadata).toHaveBeenNthCalledWith(
      2,
      { ActivityScheduledID: 2 }
    );
  });

  it('groups multiple issues that share same canonical event ID', () => {
    mockedGetCanonicalEventIdFromIssueMetadata.mockReturnValue('100');

    const { result } = setup({
      diagnosticsResult: createDiagnosticsResult({
        issues: [createIssue({ issueId: 0 }), createIssue({ issueId: 1 })],
      }),
    });

    expect(result['100']).toHaveLength(2);
    expect(result['100'][0].issueId).toBe(0);
    expect(result['100'][1].issueId).toBe(1);
  });

  it('merges matching root cause and runbook into issues', () => {
    mockedGetCanonicalEventIdFromIssueMetadata.mockReturnValue('100');

    const { result } = setup({
      diagnosticsResult: createDiagnosticsResult({
        issues: [createIssue({ issueId: 0 })],
        rootCauses: [
          {
            issueId: 0,
            rootCauseType: 'Worker failure',
            metadata: { Identity: 'worker-1' },
          },
        ],
        runbook: 'https://example.com/runbook',
      }),
    });

    expect(result['100'][0].rootCauseType).toBe('Worker failure');
    expect(result['100'][0].rootCauseMetadata).toEqual({
      Identity: 'worker-1',
    });
    expect(result['100'][0].runbook).toBe('https://example.com/runbook');
  });

  it('leaves root cause fields undefined when no matching root cause exists', () => {
    mockedGetCanonicalEventIdFromIssueMetadata.mockReturnValue('100');

    const { result } = setup({
      diagnosticsResult: createDiagnosticsResult({
        issues: [createIssue({ issueId: 0 })],
        rootCauses: [],
        runbook: 'https://example.com/runbook',
      }),
    });

    expect(result['100'][0].rootCauseType).toBeUndefined();
    expect(result['100'][0].rootCauseMetadata).toBeUndefined();
    expect(result['100'][0].runbook).toBe('https://example.com/runbook');
  });

  it('skips null groups', () => {
    mockedGetCanonicalEventIdFromIssueMetadata.mockReturnValue('100');

    const { result } = setup({
      diagnosticsResult: {
        result: {
          Timeouts: null,
          Failures: {
            issues: [createIssue({ issueId: 0 })],
            rootCauses: [],
            runbook: undefined,
          },
          Retries: null,
        },
        completed: true,
      },
    });

    expect(Object.keys(result)).toEqual(['100']);
    expect(result['100']).toHaveLength(1);
  });

  it('merges issues from multiple non-null groups', () => {
    mockedGetCanonicalEventIdFromIssueMetadata
      .mockReturnValueOnce('100')
      .mockReturnValueOnce('200');

    const { result } = setup({
      diagnosticsResult: {
        result: {
          Timeouts: {
            issues: [createIssue({ issueId: 0 })],
            rootCauses: [],
            runbook: 'timeout-runbook',
          },
          Failures: {
            issues: [createIssue({ issueId: 1 })],
            rootCauses: [],
            runbook: 'failure-runbook',
          },
          Retries: null,
        },
        completed: true,
      },
    });

    expect(result['100'][0].issueId).toBe(0);
    expect(result['100'][0].runbook).toBe('timeout-runbook');
    expect(result['200'][0].issueId).toBe(1);
    expect(result['200'][0].runbook).toBe('failure-runbook');
  });
});

function setup({
  diagnosticsResult,
}: {
  diagnosticsResult: WorkflowDiagnosticsResult;
}) {
  return {
    result: getDiagnosticsIssuesByEventId(diagnosticsResult),
  };
}

function createIssue({
  issueId,
  metadata = { ActivityScheduledID: 100 },
}: {
  issueId: number;
  metadata?: Record<string, unknown>;
}) {
  return {
    issueId,
    invariantType: 'Activity Failed',
    reason: 'Test',
    metadata,
  };
}

function createDiagnosticsResult({
  issues,
  rootCauses = [],
  runbook,
}: {
  issues: ReturnType<typeof createIssue>[];
  rootCauses?: Array<{
    issueId: number;
    rootCauseType: string;
    metadata: unknown;
  }>;
  runbook?: string;
}): WorkflowDiagnosticsResult {
  return {
    result: {
      Timeouts: null,
      Failures: {
        issues,
        rootCauses,
        runbook,
      },
      Retries: null,
    },
    completed: true,
  };
}
