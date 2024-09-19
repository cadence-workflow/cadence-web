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
  let hasMissingEvents = false;
  const groupType = 'RequestCancelExternalWorkflowExecution';

  const firstEvent = events[0];

  if (
    firstEvent.attributes !==
    'requestCancelExternalWorkflowExecutionInitiatedEventAttributes'
  ) {
    hasMissingEvents = true;
  }

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
      {}
    ),
  };
}
