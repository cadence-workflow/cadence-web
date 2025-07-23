import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';

import { type DiagnosticsIssuesGroup } from '../workflow-diagnostics.types';

export const mockWorkflowDiagnosticsIssueGroups: Array<
  [string, DiagnosticsIssuesGroup]
> = [
  ['Timeouts', mockWorkflowDiagnosticsResult.DiagnosticsResult.Timeouts],
  ['Failures', mockWorkflowDiagnosticsResult.DiagnosticsResult.Failures],
  ['Retries', mockWorkflowDiagnosticsResult.DiagnosticsResult.Retries],
];
