import {
  type WorkflowDiagnosticsRootCause,
  type WorkflowDiagnosticsIssue,
  type WorkflowDiagnosticsResult,
} from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';

export type DiagnosticsIssuesGroup =
  WorkflowDiagnosticsResult['result'][string];
export type DiagnosticsIssue = WorkflowDiagnosticsIssue;
export type DiagnosticsRootCause = WorkflowDiagnosticsRootCause;
