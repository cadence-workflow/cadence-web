import { z } from 'zod';

type WorkflowHistoryUserPreferenceConfig<T> = {
  key: string;
  schema: z.ZodType<T, z.ZodTypeDef, string>;
};

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
