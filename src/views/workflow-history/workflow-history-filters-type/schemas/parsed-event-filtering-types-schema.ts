import { z } from 'zod';

import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPES } from '../workflow-history-filters-type.constants';
import { type WorkflowHistoryEventFilteringType } from '../workflow-history-filters-type.types';

const parsedEventFilteringTypesSchema = z
  .string()
  .transform((arg) => {
    try {
      return JSON.parse(arg);
    } catch {
      return null;
    }
  })
  .pipe(
    z
      .array(z.string())
      .refine((arr) =>
        arr.every(
          (item): item is WorkflowHistoryEventFilteringType =>
            WORKFLOW_HISTORY_EVENT_FILTERING_TYPES.find((v) => v === item) !==
            undefined
        )
      )
  );
export default parsedEventFilteringTypesSchema;
