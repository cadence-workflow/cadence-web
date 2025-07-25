import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';

import { type DiagnosticsIssuesGroup } from '../workflow-diagnostics.types';

export const mockWorkflowDiagnosticsIssueGroups = [
  ['Timeouts', mockWorkflowDiagnosticsResult.result.Timeouts],
  ['Failures', mockWorkflowDiagnosticsResult.result.Failures],
  ['Retries', mockWorkflowDiagnosticsResult.result.Retries],
] as const satisfies Array<[string, DiagnosticsIssuesGroup]>;
