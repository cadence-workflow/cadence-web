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
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    initiatedEventId: parseInt(initiatedEventId),
    header: formatPayloadMap(header, 'fields'),
    ...secondaryCommonFields,
  };
};

export default formatChildWorkflowExecutionStartedEvent;
