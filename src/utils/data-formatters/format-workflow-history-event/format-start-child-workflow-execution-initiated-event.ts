import formatDurationToSeconds from '../format-duration-to-seconds';
import formatEnum from '../format-enum';
import formatInputPayload from '../format-input-payload';
import formatPayloadMap from '../format-payload-map';
import formatRetryPolicy from '../format-retry-policy';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type StartChildWorkflowExecutionInitiatedEvent } from './format-workflow-history-event.type';

const formatStartChildWorkflowExecutionInitiatedEvent = ({
  startChildWorkflowExecutionInitiatedEventAttributes: {
    control,
    decisionTaskCompletedEventId,
    delayStart,
    executionStartToCloseTimeout,
    header,
    input,
    memo,
    parentClosePolicy,
    retryPolicy,
    searchAttributes,
    taskList,
    taskStartToCloseTimeout,
    workflowIdReusePolicy,
    ...eventAttributes
  },
  ...eventFields
}: StartChildWorkflowExecutionInitiatedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    control: control ? parseInt(atob(control)) : null,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    delayStartSeconds: formatDurationToSeconds(delayStart),
    executionStartToCloseTimeoutSeconds: formatDurationToSeconds(
      executionStartToCloseTimeout
    ),
    header: formatPayloadMap(header, 'fields'),
    input: formatInputPayload(input),
    memo: formatPayloadMap(memo, 'fields'),
    parentClosePolicy: formatEnum(parentClosePolicy, 'PARENT_CLOSE_POLICY'),
    retryPolicy: formatRetryPolicy(retryPolicy),
    searchAttributes: formatPayloadMap(searchAttributes, 'indexedFields'),
    taskList: {
      kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
      name: taskList?.name || null,
    },
    taskStartToCloseTimeoutSeconds: formatDurationToSeconds(
      taskStartToCloseTimeout
    ),
    workflowIdReusePolicy: formatEnum(
      workflowIdReusePolicy,
      'WORKFLOW_ID_REUSE_POLICY',
      'pascal'
    ),
  };
};

export default formatStartChildWorkflowExecutionInitiatedEvent;
