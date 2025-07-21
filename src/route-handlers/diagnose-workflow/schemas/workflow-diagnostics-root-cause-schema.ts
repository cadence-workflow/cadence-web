import { z } from 'zod';

const workflowDiagnosticsRootCauseSchema = z.object({
  IssueID: z.number(),
  RootCauseType: z.string(),
  Metadata: z.any(),
});

export default workflowDiagnosticsRootCauseSchema;
