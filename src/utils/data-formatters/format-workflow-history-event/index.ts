import formatWorkflowExecutionCancelRequestedEventAttributes from './format-workflow-execution-cancel-requested-event-attributes';
import formatWorkflowExecutionCanceledEventAttributes from './format-workflow-execution-canceled-event-attributes';
import formatWorkflowExecutionCompletedEventAttributes from './format-workflow-execution-completed-event-attributes';
import formatWorkflowExecutionContinuedAsNewEventAttributes from './format-workflow-execution-continued-as-new-event-attributes';
import formatWorkflowExecutionFailedEventAttributes from './format-workflow-execution-failed-event-attributes';
import formatWorkflowExecutionSignaledEventAttributes from './format-workflow-execution-signaled-event-attributes';
import formatWorkflowExecutionStartedEventAttributes from './format-workflow-execution-started-event-attributes';
import formatWorkflowExecutionTerminatedEventAttributes from './format-workflow-execution-terminated-event-attributes';

const AttributesFormatterMap = {
  workflowExecutionCancelRequestedEventAttributes:
    formatWorkflowExecutionCancelRequestedEventAttributes,
  workflowExecutionCanceledEventAttributes:
    formatWorkflowExecutionCanceledEventAttributes,
  workflowExecutionCompletedEventAttributes:
    formatWorkflowExecutionCompletedEventAttributes,
  workflowExecutionContinuedAsNewEventAttributes:
    formatWorkflowExecutionContinuedAsNewEventAttributes,
  workflowExecutionFailedEventAttributes:
    formatWorkflowExecutionFailedEventAttributes,
  workflowExecutionSignaledEventAttributes:
    formatWorkflowExecutionSignaledEventAttributes,
  workflowExecutionStartedEventAttributes:
    formatWorkflowExecutionStartedEventAttributes,
  workflowExecutionTerminatedEventAttributes:
    formatWorkflowExecutionTerminatedEventAttributes,
};

export type AttributesFormattersKeys = keyof typeof AttributesFormatterMap;
export type AttributesFormattersEvent = {
  attributes: AttributesFormattersKeys;
} & Record<string, any>;

export default function formatWorkflowHistoryEvent(
  event: AttributesFormattersEvent
) {
  const formatter = AttributesFormatterMap[event.attributes];

  if (formatter) {
    return {
      [event.attributes]: formatter(event[event.attributes]),
    };
  }

  return event;
}
