/**
 * Returns whether workflow diagnostics APIs and UI are enabled.
 *
 * To enable workflow diagnostics, set the CADENCE_WORKFLOW_DIAGNOSTICS_ENABLED env variable to true.
 * For further customization, override the implementation of this resolver.
 *
 * Server version behaviour:
 * - \>= 1.4.5: Diagnostics APIs and UI will work as expected.
 * - \>= 1.3.1 & < 1.4.5: Diagnostics APIs and UI will work, but some issues are not linked to their event IDs, so they show on the Workflow Started event.
 * - \>= 1.2.13 & < 1.3.1: Diagnostics APIs will work, but the format may not be as expected; the UI does not support it.
 * - < 1.2.13: Diagnostics APIs will return a GRPC unimplemented error (maps to HTTP 404 in the client).
 *
 * @returns {Promise<boolean>} Whether workflow diagnostics are enabled.
 */
export default async function workflowDiagnosticsEnabled(): Promise<boolean> {
  return process.env.CADENCE_WORKFLOW_DIAGNOSTICS_ENABLED === 'true';
}
