import formatDurationToSeconds from '../format-duration-to-seconds';
import formatEnum from '../format-enum';
import formatFailureDetails from '../format-failure-details';
import formatInputPayload from '../format-input-payload';
import formatPayload from '../format-payload';
import formatPayloadMap from '../format-payload-map';
import formatWorkflowEventId from '../format-workflow-event-id';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionContinuedAsNewEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionContinuedAsNewEvent = ({
  workflowExecutionContinuedAsNewEventAttributes: {
    backoffStartInterval,
    decisionTaskCompletedEventId,
    executionStartToCloseTimeout,
    failure,
    header,
    initiator,
    input,
    memo,
    searchAttributes,
    taskList,
    taskStartToCloseTimeout,
    lastCompletionResult,
    ...eventAttributes
  },
  ...eventFields
}: WorkflowExecutionContinuedAsNewEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    taskList: {
      kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
      name: taskList?.name || null,
    },
    input: formatInputPayload(input),
    lastCompletionResult: formatPayload(lastCompletionResult),
    failureReason: failure?.reason || null,
    failureDetails: formatFailureDetails(failure),
    backoffStartIntervalInSeconds:
      formatDurationToSeconds(backoffStartInterval),

    executionStartToCloseTimeoutSeconds: formatDurationToSeconds(
      executionStartToCloseTimeout
    ),
    taskStartToCloseTimeoutSeconds: formatDurationToSeconds(
      taskStartToCloseTimeout
    ),
    initiator: formatEnum(initiator, 'CONTINUE_AS_NEW_INITIATOR'),
    decisionTaskCompletedEventId: formatWorkflowEventId(
      decisionTaskCompletedEventId
    ),
    header: formatPayloadMap(header, 'fields'),
    memo: formatPayloadMap(memo, 'fields'),
    searchAttributes: formatPayloadMap(searchAttributes, 'indexedFields'),
  };
};

export default formatWorkflowExecutionContinuedAsNewEvent;
