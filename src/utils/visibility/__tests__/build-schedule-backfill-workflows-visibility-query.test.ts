import buildScheduleBackfillWorkflowsVisibilityQuery from '../build-schedule-backfill-workflows-visibility-query';

describe(buildScheduleBackfillWorkflowsVisibilityQuery.name, () => {
  it('filters workflows by schedule and backfill ID', () => {
    expect(
      buildScheduleBackfillWorkflowsVisibilityQuery(
        'my-schedule',
        'backfill-abc-123'
      )
    ).toBe(
      'CadenceScheduleID = "my-schedule" AND CadenceScheduleBackfillID = "backfill-abc-123"'
    );
  });

  it('escapes special characters in query values', () => {
    expect(
      buildScheduleBackfillWorkflowsVisibilityQuery('sched"id', 'back\\fill')
    ).toBe(
      'CadenceScheduleID = "sched\\"id" AND CadenceScheduleBackfillID = "back\\\\fill"'
    );
  });
});
