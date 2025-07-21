import { z } from 'zod';

const workflowDiagnosticsIssueSchema = z.object({
  IssueID: z.number(),
  InvariantType: z.string(),
  Reason: z.string(),
  Metadata: z.any(),
});
export default workflowDiagnosticsIssueSchema;
