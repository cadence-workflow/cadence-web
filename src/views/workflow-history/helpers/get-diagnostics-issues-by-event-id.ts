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
  const mergedIssues: Array<WorkflowDiagnosticsIssue> = [];

  for (const group of Object.values(diagnosticsResult.result)) {
    if (!group) continue;

    const rootCausesById = new Map(
      (group.rootCauses ?? []).map((rc) => [rc.issueId, rc])
    );

    for (const issue of group.issues) {
      const rootCause = rootCausesById.get(issue.issueId);
      mergedIssues.push({
        ...issue,
        rootCauseType: rootCause?.rootCauseType,
        rootCauseMetadata: rootCause?.metadata,
        runbook: group.runbook,
      });
    }
  }

  return groupBy(mergedIssues, (issue) =>
    getCanonicalEventIdFromIssueMetadata(issue.metadata)
  );
}
