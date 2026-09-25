/**
 * @param hostname - The hostname to check.
 * @returns True for localhost, 127.0.0.1, ::1, [::1], and names ending in .localhost
 */
export default function isLoopbackHost(hostname: string): boolean {
  const normalized = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  return (
    normalized === 'localhost' ||
    normalized === '127.0.0.1' ||
    normalized === '::1' ||
    normalized.endsWith('.localhost')
  );
}
