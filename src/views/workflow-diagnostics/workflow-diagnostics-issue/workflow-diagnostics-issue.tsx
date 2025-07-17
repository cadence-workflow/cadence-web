import { type Props } from './workflow-diagnostics-issue.types';

export default function WorkflowDiagnosticsIssue({ issue, rootCauses }: Props) {
  return (
    <div>
      <div></div>
      <div>Issue</div>
      <div>{JSON.stringify(issue)}</div>
      <div>Root causes</div>
      <div>{JSON.stringify(rootCauses)}</div>
    </div>
  );
}
