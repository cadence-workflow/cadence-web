import formatInputPayload from '@/utils/data-formatters/format-input-payload';
import formatPayloadMap from '@/utils/data-formatters/format-payload-map';
import { type DescribeScheduleResponse } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

import { type FormattedScheduleDetails } from '../schedule-details.types';

export function formatScheduleDetails(
  describeSchedule: DescribeScheduleResponse
): FormattedScheduleDetails {
  const {
    memo: _scheduleMemo,
    action,
    ...scheduleWithoutMemo
  } = describeSchedule;
  const startWorkflow = action?.startWorkflow;

  return {
    ...scheduleWithoutMemo,
    action: action
      ? {
          ...action,
          startWorkflow: startWorkflow
            ? {
                ...startWorkflow,
                input: formatInputPayload(startWorkflow.input),
                memo: formatPayloadMap(startWorkflow.memo, 'fields'),
              }
            : startWorkflow,
        }
      : action,
  } as FormattedScheduleDetails;
}
