import { type Props } from './workflow-diagnostics-list.types';

export default function WorkflowDiagnosticsList({ diagnosticsResult }: Props) {
  return (
    <div>
      <div>Diagnostics List (WIP)</div>
      {JSON.stringify(diagnosticsResult, null, 2)}
    </div>
  );
}
