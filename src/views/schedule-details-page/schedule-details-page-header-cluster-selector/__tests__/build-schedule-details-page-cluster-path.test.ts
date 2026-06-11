import buildScheduleDetailsPageClusterPath from '../helpers/build-schedule-details-page-cluster-path';

describe(buildScheduleDetailsPageClusterPath.name, () => {
  it('builds the path with domain, cluster, scheduleId, and tab', () => {
    expect(
      buildScheduleDetailsPageClusterPath({
        domain: 'my-domain',
        cluster: 'cluster-2',
        scheduleId: 'my-schedule',
        scheduleTab: 'details',
      })
    ).toBe('/domains/my-domain/cluster-2/schedules/my-schedule/details');
  });

  it('omits the tab segment when scheduleTab is undefined', () => {
    expect(
      buildScheduleDetailsPageClusterPath({
        domain: 'my-domain',
        cluster: 'cluster-2',
        scheduleId: 'my-schedule',
        scheduleTab: undefined as never,
      })
    ).toBe('/domains/my-domain/cluster-2/schedules/my-schedule');
  });

  it('encodes special characters in domain, cluster, and scheduleId', () => {
    expect(
      buildScheduleDetailsPageClusterPath({
        domain: 'my domain',
        cluster: 'my cluster',
        scheduleId: 'schedule/id',
        scheduleTab: 'runs',
      })
    ).toBe(
      '/domains/my%20domain/my%20cluster/schedules/schedule%2Fid/runs'
    );
  });
});
