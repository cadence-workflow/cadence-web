import type {
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  HistoryGroupEventToSummaryFieldsMap,
  WorkflowSignaledEventHistoryGroup,
  WorkflowSignaledHistoryEvent,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getWorkflowSignaledEventGroupFromEvents(
  events: WorkflowSignaledHistoryEvent[]
): WorkflowSignaledEventHistoryGroup {
  const event = events[0];
  const eventToGroupLabel: Record<
    WorkflowSignaledHistoryEvent['attributes'],
    string
  > = {
    workflowExecutionSignaledEventAttributes: 'Workflow Signaled',
  };

  const label = eventToGroupLabel[event.attributes];
  const groupType = 'WorkflowSignaled';
  const hasMissingEvents = false;

  const eventToLabel: HistoryGroupEventToStringMap<WorkflowSignaledEventHistoryGroup> =
    {
      workflowExecutionSignaledEventAttributes: 'Signaled',
    };

  const eventToStatus: HistoryGroupEventToStatusMap<WorkflowSignaledEventHistoryGroup> =
    {
      workflowExecutionSignaledEventAttributes: 'COMPLETED',
    };

  const eventToSummaryFields: HistoryGroupEventToSummaryFieldsMap<WorkflowSignaledEventHistoryGroup> =
    {
      workflowExecutionSignaledEventAttributes: ['signalName', 'input'],
    };

  return {
    label,
    hasMissingEvents,
    groupType,
    ...getCommonHistoryGroupFields<WorkflowSignaledEventHistoryGroup>(
      events,
      eventToStatus,
      eventToLabel,
      {},
      undefined,
      undefined,
      undefined,
      eventToSummaryFields
    ),
  };
}
