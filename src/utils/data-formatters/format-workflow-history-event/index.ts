import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import {
  type FormattedHistoryEvent,
  getFormatHistoryEventSchema,
} from '../schema/format-history-event-schema';

export default function formatWorkflowHistoryEvent(
  event: HistoryEvent
): FormattedHistoryEvent | null {
  const schema = getFormatHistoryEventSchema(event);
  if (schema) {
    const { data } = schema.safeParse(event);
    return data ?? null;
  }
  return null;
}
