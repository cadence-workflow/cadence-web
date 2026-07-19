import getScheduleRunsQuery from '../get-schedule-runs-query';

describe(getScheduleRunsQuery.name, () => {
  it('builds a query for the schedule ID', () => {
    expect(getScheduleRunsQuery('schedule-id')).toBe(
      'CadenceScheduleID = "schedule-id" ORDER BY CadenceScheduleTime DESC'
    );
  });

  it('escapes special characters in the schedule ID', () => {
    expect(getScheduleRunsQuery(String.raw`schedule"\id`)).toBe(
      String.raw`CadenceScheduleID = "schedule\"\\id" ORDER BY CadenceScheduleTime DESC`
    );
  });

  it('applies the requested sort order', () => {
    expect(getScheduleRunsQuery('schedule-id', 'ASC')).toBe(
      'CadenceScheduleID = "schedule-id" ORDER BY CadenceScheduleTime ASC'
    );
  });
});
