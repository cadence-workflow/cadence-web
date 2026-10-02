import workflowDiagnosticsEnabled from './workflow-diagnostics-enabled';

/**
 * Returns whether workflow diagnostics are shown in the workflow history view.
 *
 * To enable, set the CADENCE_WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED env variable to `true`.
 * Workflow diagnostics must also be enabled (see workflow-diagnostics-enabled.ts).
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<boolean>} Whether workflow diagnostics are enabled in the history view.
 */
export default async function workflowDiagnosticsInHistoryEnabled(): Promise<boolean> {
  return (
    process.env.CADENCE_WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED === 'true' &&
    (await workflowDiagnosticsEnabled())
  );
}
