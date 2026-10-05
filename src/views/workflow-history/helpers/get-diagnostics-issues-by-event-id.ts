import groupBy from 'lodash/groupBy';

import { type WorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';

import {
  type WorkflowDiagnosticsIssuesByEventId,
  type WorkflowDiagnosticsIssue,
} from '../workflow-history.types';

import getCanonicalEventIdFromIssueMetadata from './get-canonical-event-id-from-issue-metadata';

export default function getDiagnosticsIssuesByEventId(
  diagnosticsResult: WorkflowDiagnosticsResult
): WorkflowDiagnosticsIssuesByEventId {
  const flattenedIssues: Array<WorkflowDiagnosticsIssue> = [];

  for (const group of Object.values(diagnosticsResult.result)) {
    if (!group) continue;

    for (const issue of group.issues) {
      flattenedIssues.push({
        ...issue,
        rootCauses: (group.rootCauses ?? []).filter(
          (rc) => rc.issueId === issue.issueId
        ),
        runbook: group.runbook,
      });
    }
  }

  return groupBy(flattenedIssues, (issue) =>
    getCanonicalEventIdFromIssueMetadata(issue.metadata)
  );
}
