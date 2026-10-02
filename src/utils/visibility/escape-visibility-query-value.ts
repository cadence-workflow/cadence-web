// Escapes backslashes and quotes so a value is safe inside a double-quoted
// visibility-query literal (e.g. `WorkflowID = "<value>"`).
export default function escapeVisibilityQueryValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/['"]/g, (match) => `\\${match}`);
}
