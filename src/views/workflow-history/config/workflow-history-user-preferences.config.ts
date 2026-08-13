import { z } from 'zod';

import { type WorkflowHistoryUserPreferenceConfig } from '../workflow-history.types';

const workflowHistoryUserPreferencesConfig = {
  ungroupedViewEnabled: {
    key: 'history-ungrouped-view-enabled',
    schema: z
      .string()
      .refine((val) => val === 'true' || val === 'false')
      .transform((val) => val === 'true'),
  },
} as const satisfies Record<string, WorkflowHistoryUserPreferenceConfig<any>>;

export default workflowHistoryUserPreferencesConfig;
