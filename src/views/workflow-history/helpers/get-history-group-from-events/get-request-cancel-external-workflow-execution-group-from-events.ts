import type {
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  RequestCancelExternalWorkflowExecutionHistoryEvent,
  RequestCancelExternalWorkflowExecutionHistoryGroup,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

export default function getRequestCancelExternalWorkflowExecutionGroupFromEvents(
  events: RequestCancelExternalWorkflowExecutionHistoryEvent[]
): RequestCancelExternalWorkflowExecutionHistoryGroup {
  const label = 'Request Cancel External Workflow';
  const groupType = 'RequestCancelExternalWorkflowExecution';

  const initiatedAttr =
    'requestCancelExternalWorkflowExecutionInitiatedEventAttributes';
  const closeAttrs = [
    'requestCancelExternalWorkflowExecutionFailedEventAttributes',
    'externalWorkflowExecutionCancelRequestedEventAttributes',
  ];

  let initiatedEvent:
    | RequestCancelExternalWorkflowExecutionHistoryEvent
    | undefined;
  let closeEvent:
    | RequestCancelExternalWorkflowExecutionHistoryEvent
    | undefined;

  events.forEach((e) => {
    if (e.attributes === initiatedAttr) initiatedEvent = e;
    if (closeAttrs.includes(e.attributes)) closeEvent = e;
  });

  const hasMissingEvents = !initiatedEvent || !closeEvent;

  const eventToLabel: HistoryGroupEventToStringMap<RequestCancelExternalWorkflowExecutionHistoryGroup> =
    {
      requestCancelExternalWorkflowExecutionInitiatedEventAttributes:
        'Initiated',
      requestCancelExternalWorkflowExecutionFailedEventAttributes: 'Failed',
      externalWorkflowExecutionCancelRequestedEventAttributes: 'Requested',
    };

  const eventToStatus: HistoryGroupEventToStatusMap<RequestCancelExternalWorkflowExecutionHistoryGroup> =
    {
      requestCancelExternalWorkflowExecutionInitiatedEventAttributes: (
        _,
        events,
        index
      ) => (index < events.length - 1 ? 'COMPLETED' : 'WAITING'),
      requestCancelExternalWorkflowExecutionFailedEventAttributes: 'FAILED',
      externalWorkflowExecutionCancelRequestedEventAttributes: 'COMPLETED',
    };

  return {
    label,
    hasMissingEvents,
    groupType,
    ...getCommonHistoryGroupFields<RequestCancelExternalWorkflowExecutionHistoryGroup>(
      events,
      eventToStatus,
      eventToLabel,
      {},
      closeEvent
    ),
  };
}
