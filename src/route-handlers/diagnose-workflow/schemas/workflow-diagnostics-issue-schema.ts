import { z } from 'zod';

const workflowDiagnosticsIssueSchema = z
  .object({
    IssueID: z.number(),
    InvariantType: z.string(),
    Reason: z.string(),
    Metadata: z.any(),
  })
  .transform(({ IssueID, InvariantType, Reason, Metadata }) => ({
    issueId: IssueID,
    invariantType: InvariantType,
    reason: Reason,
    metadata: Metadata,
  }));

export default workflowDiagnosticsIssueSchema;
