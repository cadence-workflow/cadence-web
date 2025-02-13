import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import formatDurationToSeconds from '../format-duration-to-seconds';
import formatEnum from '../format-enum';
import formatFailureDetails from '../format-failure-details';
import formatInputPayload from '../format-input-payload';
import formatPayloadMap from '../format-payload-map';
import formatPrevAutoResetPoints from '../format-prev-auto-reset-points';
import formatRetryPolicy from '../format-retry-policy';
import formatTimestampToDatetime from '../format-timestamp-to-datetime';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionStartedEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionStartedEvent = ({
  workflowExecutionStartedEventAttributes: {
    attempt,
    continuedExecutionRunId,
    continuedFailure,
    cronSchedule,
    executionStartToCloseTimeout,
    expirationTime,
    firstDecisionTaskBackoff,
    firstExecutionRunId,
    firstScheduledTime,
    identity,
    initiator,
    input,
    memo,
    originalExecutionRunId,
    parentExecutionInfo,
    prevAutoResetPoints,
    retryPolicy,
    searchAttributes,
    taskList,
    taskStartToCloseTimeout,
    ...eventAttributes
  },
  ...eventFields
}: WorkflowExecutionStartedEvent) => {
  return {
    ...formatWorkflowCommonEventFields<'workflowExecutionStartedEventAttributes'>(
      eventFields
    ),
    ...eventAttributes,
    taskList: {
      kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
      name: taskList?.name || null,
    },
    input: formatInputPayload(input),
    executionStartToCloseTimeoutSeconds: formatDurationToSeconds(
      executionStartToCloseTimeout
    ),
    taskStartToCloseTimeoutSeconds: formatDurationToSeconds(
      taskStartToCloseTimeout
    ),
    attempt: attempt || null,
    continuedExecutionRunId: continuedExecutionRunId || null,
    continuedFailureDetails: formatFailureDetails(continuedFailure),
    continuedFailureReason: continuedFailure?.reason || null,
    cronSchedule: cronSchedule || null,
    expirationTimestamp: formatTimestampToDatetime(expirationTime),
    firstDecisionTaskBackoffSeconds: formatDurationToSeconds(
      firstDecisionTaskBackoff
    ),
    firstExecutionRunId: firstExecutionRunId || null,
    firstScheduledTimeNano: firstScheduledTime
      ? parseGrpcTimestamp(firstScheduledTime)
      : null,
    identity: identity || null,
    initiator: formatEnum(initiator, 'CONTINUE_AS_NEW_INITIATOR'),
    memo: formatPayloadMap(memo, 'fields'),
    originalExecutionRunId: originalExecutionRunId || null,
    parentInitiatedEventId: parentExecutionInfo?.initiatedId
      ? parseInt(parentExecutionInfo.initiatedId)
      : null,
    parentWorkflowDomain: parentExecutionInfo?.domainName || null,
    parentWorkflowExecution: parentExecutionInfo?.workflowExecution || null,
    prevAutoResetPoints: formatPrevAutoResetPoints(prevAutoResetPoints),
    retryPolicy: formatRetryPolicy(retryPolicy),
    searchAttributes: formatPayloadMap(searchAttributes, 'indexedFields'),
  };
};

export default formatWorkflowExecutionStartedEvent;
