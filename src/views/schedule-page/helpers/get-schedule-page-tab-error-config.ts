import { RequestError } from '@/utils/request/request-error';

import { type SchedulePageTabErrorConfig } from '../schedule-page-tabs-error/schedule-page-tabs-error.types';
import { type SchedulePageTabsParams } from '../schedule-page-tabs/schedule-page-tabs.types';

export default function getSchedulePageTabErrorConfig(
  error: Error,
  params: Pick<SchedulePageTabsParams, 'domain' | 'cluster' | 'scheduleId'>,
  defaultErrorMessage: string = 'Failed to load schedule',
  fetchedContentLabel: string = 'schedule'
): SchedulePageTabErrorConfig {
  if (error instanceof RequestError && error.status === 403) {
    return {
      message: `Access denied, can't fetch ${fetchedContentLabel}`,
      omitLogging: true,
      showErrorDetails: true,
    };
  }

  if (error instanceof RequestError && error.status === 404) {
    return {
      message: `Schedule "${params.scheduleId}" was not found`,
      actions: [
        {
          kind: 'link-internal',
          label: 'Go to schedules',
          link: `/domains/${encodeURIComponent(params.domain)}/${encodeURIComponent(params.cluster)}/schedules`,
        },
      ],
      omitLogging: true,
      showErrorDetails: true,
    };
  }

  return {
    message: defaultErrorMessage,
    actions: [{ kind: 'retry', label: 'Retry' }],
    showErrorDetails: error instanceof RequestError,
  };
}
