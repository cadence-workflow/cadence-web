import { z } from 'zod';

import workflowDiagnosticsIssueSchema from './workflow-diagnostics-issue-schema';
import workflowDiagnosticsRootCauseSchema from './workflow-diagnostics-root-cause-schema';

const workflowDiagnosticsResultSchema = z.object({
  DiagnosticsResult: z.record(
    z.string(),
    z
      .object({
        Issues: z.array(workflowDiagnosticsIssueSchema),
        RootCause: z.array(workflowDiagnosticsRootCauseSchema).optional(),
        Runbooks: z.array(z.string()).optional().or(z.null()),
      })
      .or(z.null())
  ),
  DiagnosticsCompleted: z.literal(true),
});

export default workflowDiagnosticsResultSchema;
