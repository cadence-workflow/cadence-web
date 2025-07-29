import formatDurationToSeconds from '../format-duration-to-seconds';
import formatEnum from '../format-enum';
import formatInputPayload from '../format-input-payload';
import formatPayloadMap from '../format-payload-map';
import formatRetryPolicy from '../format-retry-policy';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ActivityTaskScheduledEvent } from './format-workflow-history-event.type';

const formatActivityTaskScheduledEvent = ({
  activityTaskScheduledEventAttributes: {
    decisionTaskCompletedEventId,
    domain,
    header,
    heartbeatTimeout,
    input,
    retryPolicy,
    scheduleToCloseTimeout,
    scheduleToStartTimeout,
    startToCloseTimeout,
    taskList,
    ...eventAttributes
  },
  ...eventFields
}: ActivityTaskScheduledEvent) => {
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
    heartbeatTimeoutSeconds: formatDurationToSeconds(heartbeatTimeout),
    retryPolicy: formatRetryPolicy(retryPolicy),
    scheduleToCloseTimeoutSeconds: formatDurationToSeconds(
      scheduleToCloseTimeout
    ),
    scheduleToStartTimeoutSeconds: formatDurationToSeconds(
      scheduleToStartTimeout
    ),
    startToCloseTimeoutSeconds: formatDurationToSeconds(startToCloseTimeout),
    domain: domain || null,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    header: formatPayloadMap(header, 'fields'),
    ...secondaryCommonFields,
  };
};

export default formatActivityTaskScheduledEvent;
