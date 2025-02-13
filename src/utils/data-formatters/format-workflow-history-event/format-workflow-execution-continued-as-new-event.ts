import formatDurationToSeconds from '../format-duration-to-seconds';
import formatEnum from '../format-enum';
import formatFailureDetails from '../format-failure-details';
import formatInputPayload from '../format-input-payload';
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
    ...eventAttributes
  },
  ...eventFields
}: WorkflowExecutionContinuedAsNewEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    backoffStartIntervalInSeconds:
      formatDurationToSeconds(backoffStartInterval),
    decisionTaskCompletedEventId: formatWorkflowEventId(
      decisionTaskCompletedEventId
    ),
    executionStartToCloseTimeoutSeconds: formatDurationToSeconds(
      executionStartToCloseTimeout
    ),
    failureDetails: formatFailureDetails(failure),
    failureReason: failure?.reason || '',
    header: formatPayloadMap(header, 'fields'),
    initiator: formatEnum(initiator, 'CONTINUE_AS_NEW_INITIATOR'),
    input: formatInputPayload(input),
    memo: formatPayloadMap(memo, 'fields'),
    searchAttributes: formatPayloadMap(searchAttributes, 'indexedFields'),
    taskList: {
      kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
      name: taskList?.name || null,
    },
    taskStartToCloseTimeoutSeconds: formatDurationToSeconds(
      taskStartToCloseTimeout
    ),
  };
};

export default formatWorkflowExecutionContinuedAsNewEvent;
