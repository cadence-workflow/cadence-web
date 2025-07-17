import { z } from 'zod';

import workflowDiagnosticsIssuesGroupSchema from './workflow-diagnostics-issues-group-schema';

const workflowDiagnosticsResultSchema = z.object({
  DiagnosticsResult: z.record(
    z.string(),
    workflowDiagnosticsIssuesGroupSchema.or(z.null())
  ),
  DiagnosticsCompleted: z.literal(true),
});

export default workflowDiagnosticsResultSchema;
