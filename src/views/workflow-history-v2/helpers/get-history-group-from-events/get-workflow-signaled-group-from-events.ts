import type {
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  HistoryGroupEventToSummaryFieldsMap,
  WorkflowSignaledHistoryEvent,
  WorkflowSignaledHistoryGroup,
} from '../../workflow-history-v2.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getWorkflowSignaledGroupFromEvents(
  events: WorkflowSignaledHistoryEvent[]
): WorkflowSignaledHistoryGroup {
  const event = events[0];
  const groupType = 'WorkflowSignaled';
  const hasMissingEvents = false;

  const signalName = event.workflowExecutionSignaledEventAttributes?.signalName;
  const label = `Workflow Signaled: ${signalName ?? 'Unknown Signal'}`;

  const eventToLabel: HistoryGroupEventToStringMap<WorkflowSignaledHistoryGroup> =
    {
      workflowExecutionSignaledEventAttributes: 'Signaled',
    };

  const eventToStatus: HistoryGroupEventToStatusMap<WorkflowSignaledHistoryGroup> =
    {
      workflowExecutionSignaledEventAttributes: 'COMPLETED',
    };

  const eventToSummaryFields: HistoryGroupEventToSummaryFieldsMap<WorkflowSignaledHistoryGroup> =
    {
      workflowExecutionSignaledEventAttributes: ['input'],
    };

  return {
    label,
    hasMissingEvents,
    groupType,
    ...getCommonHistoryGroupFields<WorkflowSignaledHistoryGroup>({
      events,
      historyGroupEventToStatusMap: eventToStatus,
      eventToLabelMap: eventToLabel,
      eventToTimeLabelPrefixMap: {},
      closeEvent: event,
      eventToSummaryFieldsMap: eventToSummaryFields,
    }),
  };
}
