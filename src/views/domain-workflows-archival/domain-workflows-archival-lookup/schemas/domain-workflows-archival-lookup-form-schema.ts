import { z } from 'zod';

const domainWorkflowsArchivalLookupFormSchema = z.object({
  workflowId: z.string().trim().min(1, 'Workflow ID is required'),
  runId: z.string().trim().min(1, 'Run ID is required'),
});

export default domainWorkflowsArchivalLookupFormSchema;
