import { WORKFLOW_HISTORY_DIAGNOSTICS_EVENT_ID_KEYS_CONFIG } from '../config/workflow-history-diagnostics-event-id-keys.config';

export default function getCanonicalEventIdFromIssueMetadata(
  metadata: any
): string {
  if (metadata && typeof metadata === 'object') {
    for (const key of WORKFLOW_HISTORY_DIAGNOSTICS_EVENT_ID_KEYS_CONFIG) {
      const value = metadata[key];
      if (typeof value === 'number' && value !== 0) {
        return String(value);
      }
    }
  }

  return '1';
}
