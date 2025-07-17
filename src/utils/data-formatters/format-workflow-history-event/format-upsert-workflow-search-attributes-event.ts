import formatPayloadMap from '../format-payload-map';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type UpsertWorkflowSearchAttributesEvent } from './format-workflow-history-event.type';

const formatUpsertWorkflowSearchAttributesEvent = ({
  upsertWorkflowSearchAttributesEventAttributes: {
    decisionTaskCompletedEventId,
    searchAttributes,
    ...eventAttributes
  },
  ...eventFields
}: UpsertWorkflowSearchAttributesEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    searchAttributes: formatPayloadMap(searchAttributes, 'indexedFields'),
    ...eventAttributes,
  };
};

export default formatUpsertWorkflowSearchAttributesEvent;
