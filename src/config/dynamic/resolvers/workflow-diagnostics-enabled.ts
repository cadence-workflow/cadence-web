/**
 * Returns whether workflow diagnostics APIs and UI are enabled.
 *
 * To enable workflow diagnostics, change the return value of this resolver to "true".
 *
 * Server version behavior:
 * - \>= 1.3.1: Diagnostics APIs and UI will work as expected.
 * - \>= 1.2.13 & < 1.3.1: Diagnostics APIs will work, but the format may not be as expected; only raw JSON will be displayed.
 * - < 1.2.13: Diagnostics APIs will return a GRPC unimplemented error (maps to HTTP 404 in the client).
 *
 * @returns {Promise<boolean>} Whether workflow diagnostics are enabled.
 */
export default async function workflowDiagnosticsEnabled(): Promise<boolean> {
  return false;
}
