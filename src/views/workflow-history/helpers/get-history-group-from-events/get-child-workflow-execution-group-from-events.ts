import type {
  ChildWorkflowExecutionHistoryEvent,
  ChildWorkflowExecutionHistoryGroup,
  HistoryGroupEventToNegativeFieldsMap,
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  HistoryGroupEventToSummaryFieldsMap,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getChildWorkflowExecutionGroupFromEvents(
  events: ChildWorkflowExecutionHistoryEvent[]
): ChildWorkflowExecutionHistoryGroup {
  const firstEvent = events[0];
  const childWorkflowName =
    firstEvent[firstEvent.attributes]?.workflowType?.name;

  const initiatedAttr = 'startChildWorkflowExecutionInitiatedEventAttributes';
  const startAttr = 'childWorkflowExecutionStartedEventAttributes';
  const startFailedAttr = 'startChildWorkflowExecutionFailedEventAttributes';
  const closeAttrs = [
    'childWorkflowExecutionCompletedEventAttributes',
    'childWorkflowExecutionFailedEventAttributes',
    'childWorkflowExecutionCanceledEventAttributes',
    'childWorkflowExecutionTimedOutEventAttributes',
    'childWorkflowExecutionTerminatedEventAttributes',
  ];

  let initiatedEvent: ChildWorkflowExecutionHistoryEvent | undefined;
  let startFailedEvent: ChildWorkflowExecutionHistoryEvent | undefined;
  let startEvent: ChildWorkflowExecutionHistoryEvent | undefined;
  let closeEvent: ChildWorkflowExecutionHistoryEvent | undefined;

  events.forEach((e) => {
    if (e.attributes === initiatedAttr) initiatedEvent = e;
    if (e.attributes === startAttr) startEvent = e;
    if (e.attributes === startFailedAttr) startFailedEvent = e;
    if (closeAttrs.includes(e.attributes)) closeEvent = e;
  });

  const hasAllFailureEvents = initiatedEvent && startFailedEvent;
  const hasAllCloseEvents = initiatedEvent && startEvent && closeEvent;
  const hasMissingEvents = !hasAllFailureEvents && !hasAllCloseEvents;

  const label = childWorkflowName
    ? `Child Workflow: ${childWorkflowName}`
    : 'Child Workflow';
  const groupType = 'ChildWorkflowExecution';

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

  const eventToNegativeFields: HistoryGroupEventToNegativeFieldsMap<ChildWorkflowExecutionHistoryGroup> =
    {
      childWorkflowExecutionFailedEventAttributes: ['details', 'reason'],
      childWorkflowExecutionTimedOutEventAttributes: ['details', 'reason'],
    };

  const eventToSummaryFields: HistoryGroupEventToSummaryFieldsMap<ChildWorkflowExecutionHistoryGroup> =
    {
      startChildWorkflowExecutionInitiatedEventAttributes: ['input'],
      childWorkflowExecutionStartedEventAttributes: ['workflowExecution'],
      childWorkflowExecutionCompletedEventAttributes: ['result'],
      childWorkflowExecutionFailedEventAttributes: ['details', 'reason'],
    };

  return {
    label,
    hasMissingEvents,
    groupType,
    ...getCommonHistoryGroupFields<ChildWorkflowExecutionHistoryGroup>(
      events,
      eventToStatus,
      eventToLabel,
      {},
      closeEvent || startFailedEvent,
      eventToNegativeFields,
      undefined,
      eventToSummaryFields
    ),
  };
}
