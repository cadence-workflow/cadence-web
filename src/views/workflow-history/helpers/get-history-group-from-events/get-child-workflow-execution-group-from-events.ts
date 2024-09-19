import type {
  ChildWorkflowExecutionHistoryEvent,
  ChildWorkflowExecutionHistoryGroup,
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getChildWorkflowExecutionGroupFromEvents(
  events: ChildWorkflowExecutionHistoryEvent[]
): ChildWorkflowExecutionHistoryGroup {
  const firstEvent = events[0];
  const childWorkflowName =
    firstEvent[firstEvent.attributes]?.workflowType?.name;

  const label = childWorkflowName
    ? `Child Workflow: ${childWorkflowName}`
    : 'Child Workflow';
  let hasMissingEvents = false;
  const groupType = 'ChildWorkflowExecution';

  if (
    firstEvent.attributes !==
    'startChildWorkflowExecutionInitiatedEventAttributes'
  ) {
    hasMissingEvents = true;
  }
  const eventToLabel: HistoryGroupEventToStringMap<ChildWorkflowExecutionHistoryGroup> =
    {
      startChildWorkflowExecutionInitiatedEventAttributes: 'Initiated',
      startChildWorkflowExecutionFailedEventAttributes: 'Initiation failed',
      childWorkflowExecutionStartedEventAttributes: 'Started',
      childWorkflowExecutionCompletedEventAttributes: 'Completed',
      childWorkflowExecutionFailedEventAttributes: 'Failed',
      childWorkflowExecutionCanceledEventAttributes: 'Canceled',
      childWorkflowExecutionTimedOutEventAttributes: 'Timed out',
      childWorkflowExecutionTerminatedEventAttributes: 'Terminated',
    };
  const eventToStatus: HistoryGroupEventToStatusMap<ChildWorkflowExecutionHistoryGroup> =
    {
      startChildWorkflowExecutionInitiatedEventAttributes: (
        _,
        events,
        index
      ) => (index < events.length - 1 ? 'COMPLETED' : 'WAITING'),
      startChildWorkflowExecutionFailedEventAttributes: 'FAILED',
      childWorkflowExecutionStartedEventAttributes: (_, events, index) =>
        index < events.length - 1 ? 'COMPLETED' : 'ONGOING',
      childWorkflowExecutionCompletedEventAttributes: 'COMPLETED',
      childWorkflowExecutionFailedEventAttributes: 'FAILED',
      childWorkflowExecutionCanceledEventAttributes: 'CANCELED',
      childWorkflowExecutionTimedOutEventAttributes: 'FAILED',
      childWorkflowExecutionTerminatedEventAttributes: 'FAILED',
    };

  return {
    label,
    hasMissingEvents,
    groupType,
    ...getCommonHistoryGroupFields<ChildWorkflowExecutionHistoryGroup>(
      events,
      eventToStatus,
      eventToLabel,
      {}
    ),
  };
}
