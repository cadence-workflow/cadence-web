import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import logger from '@/utils/logger';

import {
  type FormattedHistoryEvent,
  getFormatHistoryEventSchema,
} from '../schema/format-history-event-schema';

export default function formatWorkflowHistoryEvent(
  event: HistoryEvent
): FormattedHistoryEvent | null {
  const schema = getFormatHistoryEventSchema(event);
  if (schema) {
    const { data, error } = schema.safeParse(event);
    if (error) {
      logger.warn({ cause: error }, 'Failed to format workflow event');
      return null;
    }
    return data ?? null;
  }
  return null;
}
