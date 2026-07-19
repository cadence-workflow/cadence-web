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
        getScheduleRunsQuery(
          'test-schedule',
          String.raw`term"\value`,
          partialMatching
        )
      ).toBe(
        `CadenceScheduleID = "test-schedule" AND ` +
          `(RunID ${comparator} "term\\"\\\\value" OR ` +
          `WorkflowID ${comparator} "term\\"\\\\value" OR ` +
          `CadenceScheduleBackfillID ${comparator} "term\\"\\\\value")`
      );
    }
  );
});
