import type { LocalActivityHistoryEvent } from '../../workflow-history-v2.types';

export default function isLocalActivityEvent(event: {
  attributes: string;
  markerRecordedEventAttributes?: {
    markerName?: string;
  } | null;
}): event is LocalActivityHistoryEvent {
  return (
    event?.attributes === 'markerRecordedEventAttributes' &&
    event?.markerRecordedEventAttributes?.markerName === 'LocalActivity'
  );
}
