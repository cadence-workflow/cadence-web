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
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    cause,
    externalInitiatedEventId: externalExecutionInfo?.initiatedId
      ? parseInt(externalExecutionInfo.initiatedId)
      : null,
    externalWorkflowExecution: externalExecutionInfo?.workflowExecution,
    identity,
    requestId,
    ...eventAttributes,
  };
};

export default formatWorkflowExecutionCancelRequestedEvent;
