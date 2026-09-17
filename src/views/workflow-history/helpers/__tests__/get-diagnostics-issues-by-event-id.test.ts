import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';

import getDiagnosticsIssuesByEventId from '../get-diagnostics-issues-by-event-id';

describe('getDiagnosticsIssuesByEventId', () => {
  it('should group issues by canonical event ID (ActivityScheduledID)', () => {
    const result = getDiagnosticsIssuesByEventId(mockWorkflowDiagnosticsResult);

    expect(Object.keys(result).sort()).toEqual(['1', '102', '29', '43', '82']);
    expect(result['43']).toHaveLength(1);
    expect(result['43'][0].issueId).toBe(0);
    expect(result['43'][0].invariantType).toBe('Activity Failed');
  });

  it('should merge root cause data into issues', () => {
    const result = getDiagnosticsIssuesByEventId(mockWorkflowDiagnosticsResult);

    expect(result['43'][0].rootCauseType).toBe(
      'There is an issue in the worker service that is causing a failure. Check identity for service logs'
    );
    expect(result['43'][0].rootCauseMetadata).toBeNull();
  });

  it('should skip null groups', () => {
    const resultWithNullGroups = {
      ...mockWorkflowDiagnosticsResult,
      result: {
        ...mockWorkflowDiagnosticsResult.result,
        Timeouts: null,
        Retries: null,
      },
    };

    const result = getDiagnosticsIssuesByEventId(resultWithNullGroups);

    expect(Object.keys(result).sort()).toEqual(['1', '102', '29', '43', '82']);
  });

  it('should fall back to event ID 1 when no event reference is found', () => {
    const result = getDiagnosticsIssuesByEventId(mockWorkflowDiagnosticsResult);

    const workflowFailedIssue =
      mockWorkflowDiagnosticsResult.result.Failures?.issues.find(
        (issue) => issue.issueId === 4
      );
    expect(workflowFailedIssue?.metadata.ActivityScheduledID).toBe(0);
    expect(workflowFailedIssue?.metadata.ActivityStartedID).toBe(0);

    expect(result['1']).toBeDefined();
    const fallbackIssues = result['1'];
    expect(fallbackIssues.find((issue) => issue.issueId === 4)).toBeDefined();
  });

  it('should handle issues with multiple event ID fields by preferring ActivityScheduledID', () => {
    const customResult = {
      result: {
        Timeouts: null,
        Failures: {
          issues: [
            {
              issueId: 0,
              invariantType: 'Activity Failed',
              reason: 'Test',
              metadata: {
                ActivityScheduledID: 100,
                ActivityStartedID: 200,
                EventID: 300,
              },
            },
          ],
          rootCauses: [],
          runbook: undefined,
        },
        Retries: null,
      },
      completed: true as const,
    };

    const result = getDiagnosticsIssuesByEventId(customResult);

    expect(Object.keys(result)).toEqual(['100']);
    expect(result['100']).toHaveLength(1);
  });

  it('should fall back to ActivityStartedID when ActivityScheduledID is zero', () => {
    const customResult = {
      result: {
        Timeouts: null,
        Failures: {
          issues: [
            {
              issueId: 0,
              invariantType: 'Activity Failed',
              reason: 'Test',
              metadata: {
                ActivityScheduledID: 0,
                ActivityStartedID: 200,
                EventID: 300,
              },
            },
          ],
          rootCauses: [],
          runbook: undefined,
        },
        Retries: null,
      },
      completed: true as const,
    };

    const result = getDiagnosticsIssuesByEventId(customResult);

    expect(Object.keys(result)).toEqual(['200']);
  });

  it('should fall back to EventID when other IDs are zero', () => {
    const customResult = {
      result: {
        Timeouts: null,
        Failures: {
          issues: [
            {
              issueId: 0,
              invariantType: 'Activity Failed',
              reason: 'Test',
              metadata: {
                ActivityScheduledID: 0,
                ActivityStartedID: 0,
                EventID: 300,
              },
            },
          ],
          rootCauses: [],
          runbook: undefined,
        },
        Retries: null,
      },
      completed: true as const,
    };

    const result = getDiagnosticsIssuesByEventId(customResult);

    expect(Object.keys(result)).toEqual(['300']);
  });

  it('should handle missing root causes gracefully', () => {
    const customResult = {
      result: {
        Timeouts: null,
        Failures: {
          issues: [
            {
              issueId: 0,
              invariantType: 'Activity Failed',
              reason: 'Test',
              metadata: {
                ActivityScheduledID: 100,
              },
            },
          ],
          rootCauses: [],
          runbook: undefined,
        },
        Retries: null,
      },
      completed: true as const,
    };

    const result = getDiagnosticsIssuesByEventId(customResult);

    expect(result['100'][0].rootCauseType).toBeUndefined();
    expect(result['100'][0].rootCauseMetadata).toBeUndefined();
  });

  it('should group multiple issues with the same event ID', () => {
    const customResult = {
      result: {
        Timeouts: null,
        Failures: {
          issues: [
            {
              issueId: 0,
              invariantType: 'Activity Failed',
              reason: 'Test 1',
              metadata: {
                ActivityScheduledID: 100,
              },
            },
            {
              issueId: 1,
              invariantType: 'Activity Failed',
              reason: 'Test 2',
              metadata: {
                ActivityScheduledID: 100,
              },
            },
          ],
          rootCauses: [],
          runbook: undefined,
        },
        Retries: null,
      },
      completed: true as const,
    };

    const result = getDiagnosticsIssuesByEventId(customResult);

    expect(result['100']).toHaveLength(2);
    expect(result['100'][0].issueId).toBe(0);
    expect(result['100'][1].issueId).toBe(1);
  });
});
