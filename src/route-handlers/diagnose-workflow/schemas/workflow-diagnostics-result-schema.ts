import { z } from 'zod';

const workflowDiagnosticsResultSchema = z.object({
  DiagnosticsResult: z.record(
    z.string(),
    z
      .object({
        Issues: z.array(
          z.object({
            IssueID: z.number(),
            InvariantType: z.string(),
            Reason: z.string(),
            Metadata: z.any(),
          })
        ),
        RootCause: z.array(
          z.object({
            IssueID: z.number(),
            RootCauseType: z.string(),
            Metadata: z.any(),
          })
        ),
        Runbooks: z.array(z.string()),
      })
      .or(z.null())
  ),
  DiagnosticsCompleted: z.literal(true),
});

export default workflowDiagnosticsResultSchema;
