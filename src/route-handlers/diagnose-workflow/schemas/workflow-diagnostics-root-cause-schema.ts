import { z } from 'zod';

const workflowDiagnosticsRootCauseSchema = z
  .object({
    IssueID: z.number(),
    RootCauseType: z.string(),
    Metadata: z.any(),
  })
  .transform(({ IssueID, RootCauseType, Metadata }) => ({
    rootCauseType: RootCauseType,
    issueId: IssueID,
    metadata: Metadata,
  }));

export default workflowDiagnosticsRootCauseSchema;
