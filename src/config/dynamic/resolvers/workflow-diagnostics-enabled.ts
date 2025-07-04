import { type WorkflowDiagnosticsEnabledConfig } from './workflow-diagnostics-enabled.types';

export default async function workflowDiagnosticsEnabled(): Promise<WorkflowDiagnosticsEnabledConfig> {
  return {
    enabled: false,
  };
}
