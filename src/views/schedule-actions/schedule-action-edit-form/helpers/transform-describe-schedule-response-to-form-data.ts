import isNil from 'lodash/isNil';

import { type RetryPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/RetryPolicy';
import { type _uber_cadence_api_v1_ScheduleAction_StartWorkflowAction as StartWorkflowAction } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleAction';
import {
  SCHEDULE_CATCH_UP_POLICIES,
  SCHEDULE_OVERLAP_POLICIES,
} from '@/route-handlers/create-schedule/create-schedule.constants';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';
import formatDurationToSeconds from '@/utils/data-formatters/format-duration-to-seconds';
import formatInputPayload from '@/utils/data-formatters/format-input-payload';
import formatPayloadMap from '@/utils/data-formatters/format-payload-map';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import losslessJsonStringify from '@/utils/lossless-json-stringify';
import { type RetryPolicyFormFields } from '@/views/shared/retry-policy-fields/schemas/retry-policy-form-schema';

import {
  type EditScheduleFormData,
  type EditScheduleFormPrefillValues,
  type ExhaustiveDefaults,
} from '../schedule-action-edit-form.types';

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

    ...mapRetryPolicyToFormDefaults(startWorkflow?.retryPolicy),
    searchAttributes: mapSearchAttributesToFormDefaults(
      startWorkflow?.searchAttributes
    ),
    memo: mapMemoToFormDefault(startWorkflow?.memo),
  };
}

/**
 * Has its own exhaustive return type: the top-level one cannot reach into the
 * nested retry policy object, whose sub-fields are all optional too.
 */
function mapRetryPolicyToFormDefaults(
  retryPolicy: RetryPolicy | null | undefined
): ExhaustiveDefaults<RetryPolicyFormFields> {
  if (!retryPolicy) {
    return {
      enableRetryPolicy: false,
      limitRetries: undefined,
      retryPolicy: undefined,
    };
  }

  const expirationIntervalSeconds = formatDurationToSeconds(
    retryPolicy.expirationInterval
  );

  const retryPolicyValues: ExhaustiveDefaults<
    NonNullable<RetryPolicyFormFields['retryPolicy']>
  > = {
    initialIntervalSeconds: stringifyPositiveNumber(
      formatDurationToSeconds(retryPolicy.initialInterval)
    ),
    backoffCoefficient: stringifyPositiveNumber(retryPolicy.backoffCoefficient),
    maximumIntervalSeconds: stringifyPositiveNumber(
      formatDurationToSeconds(retryPolicy.maximumInterval)
    ),
    maximumAttempts: stringifyPositiveNumber(retryPolicy.maximumAttempts),
    expirationIntervalSeconds: stringifyPositiveNumber(
      expirationIntervalSeconds
    ),
  };

  return {
    enableRetryPolicy: true,
    // The form offers the two limits as an either/or, and the schedule only
    // carries an expiration interval when it was configured by duration.
    limitRetries: expirationIntervalSeconds ? 'DURATION' : 'ATTEMPTS',
    retryPolicy: retryPolicyValues,
  };
}

function mapSearchAttributesToFormDefaults(
  searchAttributes: StartWorkflowAction['searchAttributes'] | undefined
): EditScheduleFormData['searchAttributes'] {
  const decoded = formatPayloadMap(searchAttributes ?? null, 'indexedFields')
    ?.indexedFields as Record<string, unknown> | undefined;

  if (!decoded || Object.keys(decoded).length === 0) {
    return undefined;
  }

  return Object.entries(decoded).map(([key, value]) => ({
    key,
    // The form only edits primitives; anything richer keeps its JSON text.
    value:
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
        ? value
        : losslessJsonStringify(value),
  }));
}

function mapMemoToFormDefault(
  memo: StartWorkflowAction['memo'] | undefined
): string | undefined {
  const decoded = formatPayloadMap(memo ?? null, 'fields')?.fields as
    | Record<string, unknown>
    | undefined;

  return decoded && Object.keys(decoded).length > 0
    ? losslessJsonStringify(decoded, null, 2)
    : undefined;
}

/** Zero and missing values both mean "unset" for these form fields. */
function stringifyPositiveNumber(value: number | null | undefined) {
  return value ? String(value) : undefined;
}
