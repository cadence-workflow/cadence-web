import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';

import { type DiagnosticsIssuesGroup } from '../workflow-diagnostics.types';

export const mockWorkflowDiagnosticsIssueGroups = [
  ['Timeouts', mockWorkflowDiagnosticsResult.DiagnosticsResult.Timeouts],
  ['Failures', mockWorkflowDiagnosticsResult.DiagnosticsResult.Failures],
  ['Retries', mockWorkflowDiagnosticsResult.DiagnosticsResult.Retries],
] as const satisfies Array<[string, DiagnosticsIssuesGroup]>;
