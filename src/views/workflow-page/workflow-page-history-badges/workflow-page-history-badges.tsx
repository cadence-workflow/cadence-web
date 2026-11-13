'use client';

import React from 'react';

import WorkflowPageDiagnosticsBadge from '../workflow-page-diagnostics-badge/workflow-page-diagnostics-badge';
import WorkflowPagePendingEventsBadge from '../workflow-page-pending-events-badge/workflow-page-pending-events-badge';

export default function WorkflowPageHistoryBadges() {
  return (
    <>
      <WorkflowPagePendingEventsBadge />
      <WorkflowPageDiagnosticsBadge />
    </>
  );
}
