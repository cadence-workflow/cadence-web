import { z } from 'zod';

import workflowDiagnosticsIssueSchema from './workflow-diagnostics-issue-schema';
import workflowDiagnosticsRootCauseSchema from './workflow-diagnostics-root-cause-schema';

const workflowDiagnosticsResultSchema = z
  .object({
    DiagnosticsResult: z.record(
      z.string(),
      z
        .object({
          Issues: z.array(workflowDiagnosticsIssueSchema),
          RootCause: z.array(workflowDiagnosticsRootCauseSchema).optional(),
          // https://github.com/cadence-workflow/cadence/pull/7094 introduces a change to return a single runbook instead of an array
          // To retain backwards compatibility, we will support both fields but only use the first runbook link if an array is passed
          Runbook: z.string().optional().nullable(),
          Runbooks: z.array(z.string()).optional().nullable(),
        })
        .transform(({ Issues, RootCause, Runbook, Runbooks }) => {
          let runbook: string | undefined;

          if (Runbook) {
            runbook = Runbook;
          } else if (Runbooks && Runbooks.length > 0) {
            runbook = Runbooks[0];
          }

          return {
            issues: Issues,
            rootCauses: RootCause,
            runbook,
          };
        })
        .nullable()
    ),
    DiagnosticsCompleted: z.literal(true),
  })
  .transform(({ DiagnosticsCompleted, DiagnosticsResult }) => ({
    result: DiagnosticsResult,
    completed: DiagnosticsCompleted,
  }));

export default workflowDiagnosticsResultSchema;
