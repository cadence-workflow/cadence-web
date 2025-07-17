import { type WorkflowDiagnosticsIssuesGroup } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';

export type DiagnosticsIssuesGroup = WorkflowDiagnosticsIssuesGroup;
export type DiagnosticsIssue = DiagnosticsIssuesGroup['Issues'][number];
export type DiagnosticsRootCause = DiagnosticsIssuesGroup['RootCause'][number];
