import logger from '@/utils/logger';
import { type PendingHistoryEvent } from '@/views/workflow-history/workflow-history.types';

import {
  getFormatPendingStartEventSchema,
  type FormattedHistoryPendingEvent,
} from '../schema/format-history-pending-event-schema';

export default function formatPendingWorkflowHistoryEvent(
  info: PendingHistoryEvent
): FormattedHistoryPendingEvent | null {
  const schema = getFormatPendingStartEventSchema(info);
  if (schema) {
    const { data, error } = schema.safeParse(info);
    if (error) {
      logger.warn({ cause: error }, 'Failed to format workflow pending event');
      return null;
    }
    return data ?? null;
  }
  return null;
}
