import { type DescribeTaskListResponse } from '@/route-handlers/describe-task-list/describe-task-list.types';

import { getTaskListWarningMessage } from '../get-task-list-caption-message';

describe('getTaskListWarningMessage', () => {
  it('returns null when both decision and activity handlers exist', () => {
    const data = mockDescribeTaskListResponse([
      { hasDecisionHandler: true, hasActivityHandler: true },
    ]);

    expect(getTaskListWarningMessage(data)).toBeNull();
  });

  it('returns warning when there are no workers', () => {
    const data = mockDescribeTaskListResponse([]);

    expect(getTaskListWarningMessage(data)).toBe(
      'This task list has no workers'
    );
  });

  it('returns warning when no workers have any handlers', () => {
    const data = mockDescribeTaskListResponse([
      { hasDecisionHandler: false, hasActivityHandler: false },
    ]);

    expect(getTaskListWarningMessage(data)).toBe(
      'This task list has no workers'
    );
  });

  it('returns warning for missing decision workers', () => {
    const data = mockDescribeTaskListResponse([
      { hasDecisionHandler: false, hasActivityHandler: true },
    ]);

    expect(getTaskListWarningMessage(data)).toBe(
      'This task list has no decision workers'
    );
  });

  it('returns warning for missing activity workers', () => {
    const data = mockDescribeTaskListResponse([
      { hasDecisionHandler: true, hasActivityHandler: false },
    ]);

    expect(getTaskListWarningMessage(data)).toBe(
      'This task list has no activity workers'
    );
  });

  it('returns null when multiple workers cover both handlers', () => {
    const data = mockDescribeTaskListResponse([
      { hasDecisionHandler: true, hasActivityHandler: false },
      { hasDecisionHandler: false, hasActivityHandler: true },
    ]);

    expect(getTaskListWarningMessage(data)).toBeNull();
  });
});

function mockDescribeTaskListResponse(
  workers: Array<{ hasDecisionHandler: boolean; hasActivityHandler: boolean }>
): DescribeTaskListResponse {
  return {
    taskList: {
      name: 'test-task-list',
      workers: workers.map((w, i) => ({
        ...w,
        identity: `worker-${i}`,
        lastAccessTime: 1725370657336,
        ratePerSecond: 100000,
      })),
      decisionTaskListStatus: null,
      activityTaskListStatus: null,
    },
  };
}
