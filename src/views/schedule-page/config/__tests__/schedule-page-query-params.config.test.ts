import getPageQueryParamsValues from '@/hooks/use-page-query-params/helpers/get-page-query-params-values';

import schedulePageQueryParamsConfig from '../schedule-page-query-params.config';

describe('schedulePageQueryParamsConfig', () => {
  it('restores search and filter params from the URL', () => {
    expect(
      getPageQueryParamsValues(schedulePageQueryParamsConfig, {
        runsearch: 'run-123',
        runstart: 'now-30d',
        runend: 'now',
        runstatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
        runtype: 'backfill',
      })
    ).toEqual(
      expect.objectContaining({
        scheduleRunsSearch: 'run-123',
        scheduleRunsTimeStart: 'now-30d',
        scheduleRunsTimeEnd: 'now',
        scheduleRunsStatuses: ['WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED'],
        scheduleRunsRunType: 'backfill',
      })
    );
  });
});
