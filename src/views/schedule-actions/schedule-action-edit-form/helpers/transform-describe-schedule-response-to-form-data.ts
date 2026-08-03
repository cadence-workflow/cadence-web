import { CRON_FIELD_ORDER } from '@/components/cron-schedule-input/cron-schedule-input.constants';
import {
  SCHEDULE_CATCH_UP_POLICIES,
  SCHEDULE_OVERLAP_POLICIES,
  WORKER_SDK_LANGUAGES,
} from '@/route-handlers/create-schedule/create-schedule.constants';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';
import formatDurationToSeconds from '@/utils/data-formatters/format-duration-to-seconds';
import formatInputPayload from '@/utils/data-formatters/format-input-payload';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import {
  EMPTY_CRON_EXPRESSION_FIELDS,
  SECONDS_PER_DAY,
} from '../schedule-action-edit-form.constants';
import {
  type EditScheduleFormData,
  type ExhaustiveDefaults,
} from '../schedule-action-edit-form.types';

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
): ExhaustiveDefaults<EditScheduleFormData> {
  const startWorkflow = schedule.action?.startWorkflow;
  const policies = schedule.policies;
  const parsedInput = formatInputPayload(startWorkflow?.input);

  return {
    scheduleId,
    cronExpression: splitCronExpression(schedule.spec?.cronExpression),
    workflowType: { name: startWorkflow?.workflowType?.name ?? '' },
    taskList: { name: startWorkflow?.taskList?.name ?? '' },
    executionStartToCloseTimeoutSeconds:
      formatDurationToSeconds(startWorkflow?.executionStartToCloseTimeout) ?? 0,
    taskStartToCloseTimeoutSeconds:
      formatDurationToSeconds(startWorkflow?.taskStartToCloseTimeout) ?? 0,
    // The worker SDK is not stored on the schedule, only the input encoding it
    // produced, which is ambiguous between languages. Fall back to the same
    // default the create form uses.
    workerSDKLanguage: WORKER_SDK_LANGUAGES[0],
    input: parsedInput?.length
      ? parsedInput.map((value) => losslessJsonStringify(value))
      : [''],
    workflowIdPrefix: startWorkflow?.workflowIdPrefix || undefined,
    pauseOnFailure: policies?.pauseOnFailure ?? false,

    overlapPolicy: SCHEDULE_OVERLAP_POLICIES.find(
      (policy) => policy === policies?.overlapPolicy
    ),
    bufferLimit: stringifyLimit(policies?.bufferLimit),
    concurrencyLimit: stringifyLimit(policies?.concurrencyLimit),
    catchUpPolicy: SCHEDULE_CATCH_UP_POLICIES.find(
      (policy) => policy === policies?.catchUpPolicy
    ),
    catchUpWindowDays: formatCatchUpWindowDays(policies?.catchUpWindow),

    jitterSeconds:
      formatDurationToSeconds(schedule.spec?.jitter)?.toString() ?? undefined,
    startTime: formatTimestampToIso(schedule.spec?.startTime),
    endTime: formatTimestampToIso(schedule.spec?.endTime),

    // TODO(PR08d): decode the schedule's retry policy, search attributes and memo.
    enableRetryPolicy: false,
    limitRetries: undefined,
    retryPolicy: undefined,
    searchAttributes: undefined,
    memo: undefined,
  };
}

/**
 * ponytail: only plain 5-field cron expressions map onto the cron inputs. A
 * schedule using another syntax (for example `@every 1h`) prefills empty, so the
 * form asks for a cron rather than silently mangling it. Upgrade path: teach
 * `CronScheduleInput` about the other syntaxes and widen this.
 */
function splitCronExpression(
  cronExpression: string | undefined
): EditScheduleFormData['cronExpression'] {
  const fields = cronExpression?.trim().split(/\s+/) ?? [];

  if (fields.length !== CRON_FIELD_ORDER.length) {
    return EMPTY_CRON_EXPRESSION_FIELDS;
  }

  return Object.fromEntries(
    CRON_FIELD_ORDER.map((field, index) => [field, fields[index]])
  ) as EditScheduleFormData['cronExpression'];
}

function stringifyLimit(limit: number | undefined): string | undefined {
  return limit === undefined ? undefined : String(limit);
}

/**
 * The form only accepts whole days, so a partial day rounds up rather than down
 * to avoid narrowing the window the schedule already runs with.
 */
function formatCatchUpWindowDays(
  catchUpWindow: Parameters<typeof formatDurationToSeconds>[0]
): string | undefined {
  const seconds = formatDurationToSeconds(catchUpWindow);

  return seconds ? String(Math.ceil(seconds / SECONDS_PER_DAY)) : undefined;
}

function formatTimestampToIso(
  timestamp: Parameters<typeof parseGrpcTimestamp>[0] | null | undefined
): string | undefined {
  return timestamp
    ? new Date(parseGrpcTimestamp(timestamp)).toISOString()
    : undefined;
}
