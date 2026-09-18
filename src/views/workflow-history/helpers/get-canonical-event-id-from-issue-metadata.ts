import WORKFLOW_HISTORY_DIAGNOSTICS_EVENT_ID_KEY from '../config/workflow-history-diagnostics-event-id-key.config';

export default function getCanonicalEventIdFromIssueMetadata(
  metadata: any
): string {
  if (metadata && typeof metadata === 'object') {
    const value = metadata[WORKFLOW_HISTORY_DIAGNOSTICS_EVENT_ID_KEY];
    if (typeof value === 'number' && value !== 0) {
      return String(value);
    }
  }

  return '1';
}
