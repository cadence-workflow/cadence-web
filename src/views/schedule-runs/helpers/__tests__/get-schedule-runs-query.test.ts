import getScheduleRunsQuery from '../get-schedule-runs-query';

describe(getScheduleRunsQuery.name, () => {
  it('builds a query for the schedule ID', () => {
    expect(getScheduleRunsQuery('schedule-id')).toBe(
      'CadenceScheduleID = "schedule-id"'
    );
  });

  it('escapes special characters in the schedule ID', () => {
    expect(getScheduleRunsQuery(String.raw`schedule"\id`)).toBe(
      String.raw`CadenceScheduleID = "schedule\"\\id"`
    );
  });

  it.each([
    [false, '='],
    [true, 'LIKE'],
  ])(
    'searches IDs with partial matching set to %s',
    (partialMatching, comparator) => {
      expect(
        getScheduleRunsQuery('test-schedule', {
          search: String.raw`term"\value`,
          isPartialMatchingEnabled: partialMatching,
        })
      ).toBe(
        `CadenceScheduleID = "test-schedule" AND ` +
          `(RunID ${comparator} "term\\"\\\\value" OR ` +
          `WorkflowID ${comparator} "term\\"\\\\value" OR ` +
          `CadenceScheduleBackfillID ${comparator} "term\\"\\\\value")`
      );
    }
  );

  it('combines schedule time and workflow status filters', () => {
    expect(
      getScheduleRunsQuery('test-schedule', {
        timeRangeStart: '2026-07-12T10:00:00.000Z',
        timeRangeEnd: '2026-07-19T10:00:00.000Z',
        statuses: [
          'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
          'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
        ],
      })
    ).toBe(
      'CadenceScheduleID = "test-schedule" AND ' +
        '(CloseStatus = 1 OR CloseTime = missing) AND ' +
        'CadenceScheduleTime > "2026-07-12T10:00:00.000Z" AND ' +
        'CadenceScheduleTime <= "2026-07-19T10:00:00.000Z"'
    );
  });

  it.each([
    ['backfill', 'true'],
    ['regular', 'false'],
  ] as const)('queries %s runs', (runType, expectedValue) => {
    expect(
      getScheduleRunsQuery('test-schedule', { runType })
    ).toContain(`CadenceScheduleIsBackfill = "${expectedValue}"`);
  });
});
