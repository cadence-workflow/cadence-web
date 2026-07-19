import getPageQueryParamsValues from '@/hooks/use-page-query-params/helpers/get-page-query-params-values';

import schedulePageQueryParamsConfig from '../schedule-page-query-params.config';

describe('schedulePageQueryParamsConfig', () => {
  it('restores a relative Schedule time range from the URL', () => {
    expect(
      getPageQueryParamsValues(schedulePageQueryParamsConfig, {
        'runs-start': 'now-30d',
        'runs-end': 'now',
      })
    ).toEqual({
      scheduleRunsTimeStart: 'now-30d',
      scheduleRunsTimeEnd: 'now',
    });
  });
});
