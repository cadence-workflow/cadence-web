import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import formatDurationToSeconds from '../format-duration-to-seconds';
import formatEnum from '../format-enum';
import formatFailureDetails from '../format-failure-details';
import formatInputPayload from '../format-input-payload';
import formatPayload from '../format-payload';
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
    header,
    workflowType,
    lastCompletionResult,
    ...eventAttributes
  },
  ...eventFields
}: WorkflowExecutionStartedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields<'workflowExecutionStartedEventAttributes'>(
      eventFields
    );

  return {
    ...primaryCommonFields,
    workflowType,
    taskList: {
      kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
      name: taskList?.name || null,
    },
    input: formatInputPayload(input),
    lastCompletionResult: formatPayload(lastCompletionResult),
    executionStartToCloseTimeoutSeconds: formatDurationToSeconds(
      executionStartToCloseTimeout
    ),
    taskStartToCloseTimeoutSeconds: formatDurationToSeconds(
      taskStartToCloseTimeout
    ),
    firstDecisionTaskBackoffSeconds: formatDurationToSeconds(
      firstDecisionTaskBackoff
    ),
    attempt: attempt || null,
    continuedExecutionRunId: continuedExecutionRunId || null,
    continuedFailureDetails: formatFailureDetails(continuedFailure),
    continuedFailureReason: continuedFailure?.reason || null,
    cronSchedule: cronSchedule || null,
    expirationTimestamp: formatTimestampToDatetime(expirationTime),
    firstExecutionRunId: firstExecutionRunId || null,
    firstScheduledTimeNano: firstScheduledTime
      ? parseGrpcTimestamp(firstScheduledTime)
      : null,
    originalExecutionRunId: originalExecutionRunId || null,
    parentInitiatedEventId: parentExecutionInfo?.initiatedId
      ? parseInt(parentExecutionInfo.initiatedId)
      : null,
    parentWorkflowDomain: parentExecutionInfo?.domainName || null,
    parentWorkflowExecution: parentExecutionInfo?.workflowExecution || null,
    retryPolicy: formatRetryPolicy(retryPolicy),
    identity: identity || null,
    initiator: formatEnum(initiator, 'CONTINUE_AS_NEW_INITIATOR'),
    header: formatPayloadMap(header, 'fields'),
    memo: formatPayloadMap(memo, 'fields'),
    searchAttributes: formatPayloadMap(searchAttributes, 'indexedFields'),
    prevAutoResetPoints: formatPrevAutoResetPoints(prevAutoResetPoints),
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatWorkflowExecutionStartedEvent;
