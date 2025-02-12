import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionCancelRequestedEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionCancelRequestedEvent = ({
  workflowExecutionCancelRequestedEventAttributes: {
    externalExecutionInfo,
    ...eventAttributes
  },
  ...eventFields
}: WorkflowExecutionCancelRequestedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    externalInitiatedEventId: externalExecutionInfo?.initiatedId
      ? parseInt(externalExecutionInfo.initiatedId)
      : null,
    externalWorkflowExecution: externalExecutionInfo?.workflowExecution,
  };
};

export default formatWorkflowExecutionCancelRequestedEvent;
