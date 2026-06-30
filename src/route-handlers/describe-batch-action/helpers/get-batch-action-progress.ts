import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { type Payload } from '@/__generated__/proto-ts/uber/cadence/api/v1/Payload';
import formatPayload from '@/utils/data-formatters/format-payload';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import { type BatchActionProgressResult } from '../describe-batch-action.types';
import heartbeatDetailsSchema from '../schemas/heartbeat-details-schema';

function parseHeartBeatDetails(
  payload: Payload | null | undefined
): BatchActionProgressResult {
  // No payload means no progress has been reported yet — not an error.
  if (!payload?.data) return {};

  const result = heartbeatDetailsSchema.safeParse(formatPayload(payload));
  if (!result.success) {
    // A payload is present but does not match the expected shape. Surface it
    // rather than silently dropping it, so wrong assumptions about the heartbeat
    // structure don't hide behind perpetually-missing progress.
    logger.warn<RouteHandlerErrorPayload>(
      { error: result.error },
      'Batch action heartbeat did not match the expected shape'
    );
    return { progressError: true };
  }

  // The heartbeat carries both progress counts and the live, signal-tuned rps;
  // split them so rps surfaces at the top level (overriding the start-input
  // value) while progress stays counts-only. Omit rps when absent so it never
  // clobbers the input rps with undefined.
  const { rps, ...progress } = result.data;
  return { progress, ...(rps !== undefined ? { rps } : {}) };
}

// While the batch is running, progress is surfaced on the batcher activity's
// heartbeatDetails. Returns the first pending activity that carries a decodable
// HeartBeatDetails payload; otherwise flags progressError if any payload was
// present but malformed, or an empty result when none is available yet.
export function getRunningProgressFromDescribe(
  response: DescribeWorkflowExecutionResponse
): BatchActionProgressResult {
  let progressError = false;
  for (const activity of response.pendingActivities ?? []) {
    const result = parseHeartBeatDetails(activity.heartbeatDetails);
    if (result.progress) return result;
    if (result.progressError) progressError = true;
  }
  return progressError ? { progressError: true } : {};
}

// On completion the workflow returns its final HeartBeatDetails as the result
// carried by the WorkflowExecutionCompletedEvent.
export function getFinalProgressFromCloseEvent(
  event: HistoryEvent | undefined
): BatchActionProgressResult {
  return parseHeartBeatDetails(
    event?.workflowExecutionCompletedEventAttributes?.result
  );
}
