import { type ViewComponentProps } from '../workflow-diagnostics-content/workflow-diagnostics-content.types';

export default function WorkflowDiagnosticsJson({
  diagnosticsResponse,
}: ViewComponentProps) {
  return (
    <div>
      <div>Diagnostics JSON (WIP)</div>
      {JSON.stringify(diagnosticsResponse.result, null, 2)}
    </div>
  );
}
