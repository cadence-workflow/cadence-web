'use client';

import React from 'react';

import useConfigValue from '@/hooks/use-config-value/use-config-value';

import WorkflowPageDiagnosticsBadge from '../workflow-page-diagnostics-badge/workflow-page-diagnostics-badge';
import WorkflowPagePendingEventsBadge from '../workflow-page-pending-events-badge/workflow-page-pending-events-badge';

import { styled } from './workflow-page-history-tab-badges.styles';

export default function WorkflowPageHistoryTabBadges() {
  const { data: isDiagnosticsInHistoryEnabled } = useConfigValue(
    'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'
  );

  return (
    <styled.Container>
      {isDiagnosticsInHistoryEnabled ? <WorkflowPageDiagnosticsBadge /> : null}
      <WorkflowPagePendingEventsBadge />
    </styled.Container>
  );
}
