 import { WORKFLOW_DIAGNOSTICS_EVENT_ID_KEY, WORKFLOW_STARTED_EVENT_ID } from '../workflow-history.constants';

export default function getCanonicalEventIdFromIssueMetadata(
  metadata: any
): string {
  if (metadata && typeof metadata === 'object') {
    const value = metadata[WORKFLOW_DIAGNOSTICS_EVENT_ID_KEY];
    if (typeof value === 'number' && value !== 0) {
      return String(value);
    }
  }

  return WORKFLOW_STARTED_EVENT_ID;
}
