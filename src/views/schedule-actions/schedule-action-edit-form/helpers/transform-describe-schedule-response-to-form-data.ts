import isNil from 'lodash/isNil';

import {
  SCHEDULE_CATCH_UP_POLICIES,
  SCHEDULE_OVERLAP_POLICIES,
} from '@/route-handlers/create-schedule/create-schedule.constants';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';
import formatDurationToSeconds from '@/utils/data-formatters/format-duration-to-seconds';
import formatInputPayload from '@/utils/data-formatters/format-input-payload';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { type EditScheduleFormPrefillValues } from '../schedule-action-edit-form.types';

import mapCronExpressionToFormFields from './map-cron-expression-to-form-fields';

/**
 * Builds the edit form's default values from an existing schedule.
 *
 * The return type deliberately makes every key required: forgetting to map a
 * newly-added form field then fails `npm run typecheck` instead of silently
 * prefilling that field as blank.
 */
export default function transformDescribeScheduleResponseToFormData(
  schedule: DescribeScheduleResponse,
  scheduleId: string
): EditScheduleFormPrefillValues {
  const startWorkflow = schedule.action?.startWorkflow;
  const policies = schedule.policies;
  const parsedInput = formatInputPayload(startWorkflow?.input);

  return {
    scheduleId,
    cronExpression: mapCronExpressionToFormFields(
      schedule.spec?.cronExpression
    ),
    workflowType: { name: startWorkflow?.workflowType?.name ?? '' },
    taskList: { name: startWorkflow?.taskList?.name ?? '' },
    executionStartToCloseTimeoutSeconds:
      formatDurationToSeconds(startWorkflow?.executionStartToCloseTimeout) ??
      undefined,
    // Cadence stores encoded input bytes only; the worker SDK is not persisted.
    workerSDKLanguage: undefined,
    input: parsedInput?.length
      ? parsedInput.map((value) => losslessJsonStringify(value))
      : [''],
    workflowIdPrefix: startWorkflow?.workflowIdPrefix || undefined,
    pauseOnFailure: policies?.pauseOnFailure ?? false,

    overlapPolicy: SCHEDULE_OVERLAP_POLICIES.find(
      (policy) => policy === policies?.overlapPolicy
    ),
    bufferLimit: isNil(policies?.bufferLimit)
      ? undefined
      : String(policies?.bufferLimit),
    concurrencyLimit: isNil(policies?.concurrencyLimit)
      ? undefined
      : String(policies.concurrencyLimit),
    catchUpPolicy: SCHEDULE_CATCH_UP_POLICIES.find(
      (policy) => policy === policies?.catchUpPolicy
    ),
    catchUpWindowSeconds:
      formatDurationToSeconds(policies?.catchUpWindow)?.toString() ?? undefined,

    jitterSeconds:
      formatDurationToSeconds(schedule.spec?.jitter)?.toString() ?? undefined,
    startTime: schedule.spec?.startTime
      ? new Date(parseGrpcTimestamp(schedule.spec.startTime)).toISOString()
      : undefined,
    endTime: schedule.spec?.endTime
      ? new Date(parseGrpcTimestamp(schedule.spec.endTime)).toISOString()
      : undefined,

    // TODO(PR08d): decode the schedule's retry policy, search attributes and memo.
    enableRetryPolicy: false,
    limitRetries: undefined,
    retryPolicy: undefined,
    searchAttributes: undefined,
    memo: undefined,
  };
}
