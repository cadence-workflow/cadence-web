/** True for localhost, 127.0.0.1, ::1 (brackets ignored), and names ending in .localhost.
 * Trust checks should pass a configured host, not the request host.
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
