import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionCancelRequestedEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionCancelRequestedEvent = ({
  workflowExecutionCancelRequestedEventAttributes: {
    externalExecutionInfo,
    requestId,
    cause,
    identity,
    ...eventAttributes
  },
  ...eventFields
}: WorkflowExecutionCancelRequestedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    cause,
    externalInitiatedEventId: externalExecutionInfo?.initiatedId
      ? parseInt(externalExecutionInfo.initiatedId)
      : null,
    externalWorkflowExecution: externalExecutionInfo?.workflowExecution,
    identity,
    requestId,
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatWorkflowExecutionCancelRequestedEvent;
