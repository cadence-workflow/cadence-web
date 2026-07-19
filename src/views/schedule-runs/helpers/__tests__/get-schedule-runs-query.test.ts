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
});
