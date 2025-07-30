import parsedEventFilteringTypesSchema from '../schemas/parsed-event-filtering-types-schema';
import { type WorkflowHistoryEventFilteringType } from '../workflow-history-filters-type.types';

export default function parseEventFilteringTypes(
  maybeTypes: string | null
): Array<WorkflowHistoryEventFilteringType> | undefined {
  const { data } = parsedEventFilteringTypesSchema.safeParse(maybeTypes);
  return data;
}
