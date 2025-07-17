import type {
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  SignalExternalWorkflowExecutionHistoryEvent,
  SignalExternalWorkflowExecutionHistoryGroup,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getSignalExternalWorkflowExecutionGroupFromEvents(
  events: SignalExternalWorkflowExecutionHistoryEvent[]
): SignalExternalWorkflowExecutionHistoryGroup {
  let label = '';
  const groupType = 'SignalExternalWorkflowExecution';

  const initiatedAttr =
    'signalExternalWorkflowExecutionInitiatedEventAttributes';

  const closeAttrs = [
    'signalExternalWorkflowExecutionFailedEventAttributes',
    'externalWorkflowExecutionSignaledEventAttributes',
  ];

  let initiatedEvent: SignalExternalWorkflowExecutionHistoryEvent | undefined;
  let closeEvent: SignalExternalWorkflowExecutionHistoryEvent | undefined;

  events.forEach((e) => {
    if (e.attributes === initiatedAttr) initiatedEvent = e;
    if (closeAttrs.includes(e.attributes)) closeEvent = e;
  });

  const hasMissingEvents = !initiatedEvent || !closeEvent;

  if (initiatedEvent) {
    label = `External Workflow Signal: ${initiatedEvent[initiatedAttr]?.signalName}`;
  }

  const eventToLabel: HistoryGroupEventToStringMap<SignalExternalWorkflowExecutionHistoryGroup> =
    {
      signalExternalWorkflowExecutionInitiatedEventAttributes: 'Initiated',
      signalExternalWorkflowExecutionFailedEventAttributes: 'Failed',
      externalWorkflowExecutionSignaledEventAttributes: 'Signaled',
    };

  const eventToStatus: HistoryGroupEventToStatusMap<SignalExternalWorkflowExecutionHistoryGroup> =
    {
      signalExternalWorkflowExecutionInitiatedEventAttributes: (
        _,
        events,
        index
      ) => (index < events.length - 1 ? 'COMPLETED' : 'WAITING'),
      signalExternalWorkflowExecutionFailedEventAttributes: 'FAILED',
      externalWorkflowExecutionSignaledEventAttributes: 'COMPLETED',
    };

  return {
    label,
    hasMissingEvents,
    groupType,
    ...getCommonHistoryGroupFields<SignalExternalWorkflowExecutionHistoryGroup>(
      events,
      eventToStatus,
      eventToLabel,
      {},
      closeEvent
    ),
  };
}
