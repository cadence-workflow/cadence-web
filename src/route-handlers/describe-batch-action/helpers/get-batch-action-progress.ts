import { z } from 'zod';

import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { type Payload } from '@/__generated__/proto-ts/uber/cadence/api/v1/Payload';
import formatPayload from '@/utils/data-formatters/format-payload';
import { type BatchActionProgress } from '@/views/domain-batch-actions/domain-batch-actions.types';

// The batcher records progress in a HeartBeatDetails struct
const heartBeatDetailsSchema = z
  .object({
    TotalEstimate: z.number(),
    SuccessCount: z.number().catch(0),
    ErrorCount: z.number().catch(0),
  })
  .transform(({ TotalEstimate, SuccessCount, ErrorCount }) => ({
    totalEstimate: TotalEstimate,
    successCount: SuccessCount,
    errorCount: ErrorCount,
  }));

function parseHeartBeatDetails(
  payload: Payload | null | undefined
): BatchActionProgress | undefined {
  if (!payload?.data) return undefined;
  const result = heartBeatDetailsSchema.safeParse(formatPayload(payload));
  return result.success ? result.data : undefined;
}

// While the batch is running, progress is surfaced on the batcher activity's
// heartbeatDetails. Returns the first pending activity that carries a decodable
// HeartBeatDetails payload, or undefined when none is available yet.
export function getRunningProgressFromDescribe(
  response: DescribeWorkflowExecutionResponse
): BatchActionProgress | undefined {
  for (const activity of response.pendingActivities ?? []) {
    const progress = parseHeartBeatDetails(activity.heartbeatDetails);
    if (progress) return progress;
  }
  return undefined;
}

// On completion the workflow returns its final HeartBeatDetails as the result
// carried by the WorkflowExecutionCompletedEvent.
export function getFinalProgressFromCloseEvent(
  event: HistoryEvent | undefined
): BatchActionProgress | undefined {
  return parseHeartBeatDetails(
    event?.workflowExecutionCompletedEventAttributes?.result
  );
}
