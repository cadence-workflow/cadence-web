import formatPayloadMap from '../format-payload-map';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ChildWorkflowExecutionStartedEvent } from './format-workflow-history-event.type';

const formatChildWorkflowExecutionStartedEvent = ({
  childWorkflowExecutionStartedEventAttributes: {
    header,
    initiatedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ChildWorkflowExecutionStartedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    header: formatPayloadMap(header, 'fields'),
    initiatedEventId: parseInt(initiatedEventId),
  };
};

export default formatChildWorkflowExecutionStartedEvent;
