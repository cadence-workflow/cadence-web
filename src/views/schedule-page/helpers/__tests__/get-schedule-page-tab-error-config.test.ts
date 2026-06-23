import { RequestError } from '@/utils/request/request-error';

import getSchedulePageTabErrorConfig from '../get-schedule-page-tab-error-config';

const params = {
  domain: 'test-domain',
  cluster: 'test-cluster',
  scheduleId: 'my-schedule',
} as const;

describe(getSchedulePageTabErrorConfig.name, () => {
  it('returns default error config for regular error', () => {
    expect(
      getSchedulePageTabErrorConfig(new Error('Test error'), params)
    ).toEqual({
      message: 'Failed to load schedule',
      actions: [{ kind: 'retry', label: 'Retry' }],
      showErrorDetails: false,
    });
  });

  it('returns not found error config when request error status is 404', () => {
    expect(
      getSchedulePageTabErrorConfig(
        new RequestError('test error', '/schedule', 404),
        params
      )
    ).toEqual({
      message: 'Schedule "my-schedule" was not found',
      actions: [
        {
          kind: 'link-internal',
          label: 'Go to schedules',
          link: '/domains/test-domain/test-cluster/schedules',
        },
      ],
      omitLogging: true,
      showErrorDetails: true,
    });
  });

  it('returns access denied error config when request error status is 403', () => {
    expect(
      getSchedulePageTabErrorConfig(
        new RequestError('test error', '/schedule-runs', 403),
        params,
        undefined,
        'schedule runs'
      )
    ).toEqual({
      message: `Access denied, can't fetch schedule runs`,
      omitLogging: true,
      showErrorDetails: true,
    });
  });
});
