import ErrorPanel from '@/components/error-panel/error-panel';

import { type ViewComponentProps } from '../workflow-diagnostics-content/workflow-diagnostics-content.types';

export default function WorkflowDiagnosticsList({
  diagnosticsResponse,
}: ViewComponentProps) {
  // This case is unreachable because the List view is disabled if diagnostics parsing fails
  if (diagnosticsResponse.parsingError) {
    return <ErrorPanel message="Failed to parse workflow diagnostics" />;
  }

  return (
    <div>
      <div>Diagnostics List (WIP)</div>
      {JSON.stringify(diagnosticsResponse.result, null, 2)}
    </div>
  );
}
