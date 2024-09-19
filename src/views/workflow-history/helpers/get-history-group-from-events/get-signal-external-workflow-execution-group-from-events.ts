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
  let hasMissingEvents = false;
  const groupType = 'SignalExternalWorkflowExecution';

  const initiationEventAttr =
    'signalExternalWorkflowExecutionInitiatedEventAttributes';
  const initiationEvent = events.find(
    ({ attributes }) => attributes === initiationEventAttr
  );
  const firstEvent = events[0];

  if (initiationEvent) {
    label = `External Workflow Signal: ${initiationEvent[initiationEventAttr]?.signalName}`;
  }

  if (
    firstEvent.attributes !==
    'signalExternalWorkflowExecutionInitiatedEventAttributes'
  ) {
    hasMissingEvents = true;
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
      {}
    ),
  };
}
