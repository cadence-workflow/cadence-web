import logger from '@/utils/logger';
import { type PendingHistoryEvent } from '@/views/workflow-history-v2/workflow-history-v2.types';

import {
  getFormatPendingEventSchema,
  type FormattedHistoryPendingEvent,
} from '../schema/format-history-pending-event-schema';

export default function formatPendingWorkflowHistoryEvent(
  event: PendingHistoryEvent
): FormattedHistoryPendingEvent | null {
  const schema = getFormatPendingEventSchema(event);
  if (schema) {
    const { data, error } = schema.safeParse(event);
    if (error) {
      logger.warn({ error: error }, 'Failed to format workflow pending event');
      return null;
    }
    return data ?? null;
  }
  return null;
}
