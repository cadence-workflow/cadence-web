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
    cronSchedule,
    jitterStart,
    firstRunAt,
    ...eventAttributes
  },
  ...eventFields
}: StartChildWorkflowExecutionInitiatedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    taskList: {
      kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
      name: taskList?.name || null,
    },
    input: formatInputPayload(input),
    control: control ? parseInt(atob(control)) : null,
    jitterStart,
    delayStartSeconds: formatDurationToSeconds(delayStart),
    firstRunAt,
    executionStartToCloseTimeoutSeconds: formatDurationToSeconds(
      executionStartToCloseTimeout
    ),
    taskStartToCloseTimeoutSeconds: formatDurationToSeconds(
      taskStartToCloseTimeout
    ),
    retryPolicy: formatRetryPolicy(retryPolicy),
    parentClosePolicy: formatEnum(parentClosePolicy, 'PARENT_CLOSE_POLICY'),
    workflowIdReusePolicy: formatEnum(
      workflowIdReusePolicy,
      'WORKFLOW_ID_REUSE_POLICY',
      'pascal'
    ),
    cronSchedule: cronSchedule || null,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    header: formatPayloadMap(header, 'fields'),
    memo: formatPayloadMap(memo, 'fields'),
    searchAttributes: formatPayloadMap(searchAttributes, 'indexedFields'),
    ...secondaryCommonFields,
  };
};

export default formatStartChildWorkflowExecutionInitiatedEvent;
