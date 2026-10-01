'use client';

import React from 'react';

import useConfigValue from '@/hooks/use-config-value/use-config-value';

import WorkflowPageDiagnosticsBadge from '../workflow-page-diagnostics-badge/workflow-page-diagnostics-badge';
import WorkflowPagePendingEventsBadge from '../workflow-page-pending-events-badge/workflow-page-pending-events-badge';

export default function WorkflowPageHistoryBadges() {
  // TODO: simplify once the old Workflow Diagnostics view has been deleted
  const { data: isWorkflowDiagnosticsInHistoryEnabled } = useConfigValue(
    'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'
  );

  return (
    <>
      <WorkflowPagePendingEventsBadge />
      {isWorkflowDiagnosticsInHistoryEnabled && (
        <WorkflowPageDiagnosticsBadge />
      )}
    </>
  );
}
