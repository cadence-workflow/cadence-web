import WorkflowDiagnosticsJson from '../workflow-diagnostics-json/workflow-diagnostics-json';
import WorkflowDiagnosticsViewToggle from '../workflow-diagnostics-view-toggle/workflow-diagnostics-view-toggle';

import { styled } from './workflow-diagnostics-fallback.styles';
import { type Props } from './workflow-diagnostics-fallback.types';

export default function WorkflowDiagnosticsFallback({
  workflowId,
  runId,
  diagnosticsResult,
}: Props) {
  return (
    <>
      <styled.ButtonsContainer>
        <WorkflowDiagnosticsViewToggle listEnabled={false} />
      </styled.ButtonsContainer>
      <WorkflowDiagnosticsJson
        workflowId={workflowId}
        runId={runId}
        diagnosticsResult={diagnosticsResult}
      />
    </>
  );
}
