import { isArray } from 'lodash';
import { z } from 'zod';

import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPES } from '../workflow-history-filters-type/workflow-history-filters-type.constants';
import { type WorkflowHistoryEventFilteringType } from '../workflow-history-filters-type/workflow-history-filters-type.types';
import { type WorkflowHistoryUserPreferenceConfig } from '../workflow-history.types';

const workflowHistoryUserPreferencesConfig = {
  ungroupedViewEnabled: {
    key: 'history-ungrouped-view-enabled',
    schema: z
      .string()
      .refine((val) => val === 'true' || val === 'false')
      .transform((val) => val === 'true'),
  },
  historyEventTypes: {
    key: 'history-event-types',
    schema: z
      .string()
      .transform((arg) => {
        try {
          return JSON.parse(arg);
        } catch {
          return null;
        }
      })
      .refine(
        (val) =>
          isArray(val) &&
          val.every(
            (item): item is WorkflowHistoryEventFilteringType =>
              WORKFLOW_HISTORY_EVENT_FILTERING_TYPES.find((v) => v === item) !==
              undefined
          )
      ),
  },
} as const satisfies Record<string, WorkflowHistoryUserPreferenceConfig<any>>;

export default workflowHistoryUserPreferencesConfig;
