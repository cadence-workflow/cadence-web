/**
 * Static loopback predicate with two call-site contracts:
 * - Config-time trust decisions (e.g. an OIDC example-secret boot guard)
 *   MUST pass config-resolved hosts (the redirectUri host) — never
 *   request-time Host/XFP headers, which are client-spoofable.
 * - The plain-HTTP deployment-hygiene WARN intentionally passes the request's host:
 *   it detects real plain-HTTP traffic reaching a non-loopback deployment,
 *   and jwt/disabled deployments have no config host to consult. A spoofed
 *   Host can only suppress the warning for the spoofer's own request.
 * `.localhost` names are loopback per RFC 6761. URL.hostname keeps IPv6
 * brackets (`[::1]`), so they are stripped before comparing.
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
