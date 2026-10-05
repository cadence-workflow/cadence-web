import { type NextRequest } from 'next/server';

/**
 * Login-CSRF guard for cookie-setting endpoints: browsers attach an Origin
 * header to cross-site POSTs, so a mismatch with the request host means the
 * request was forged from another site. Requests without an Origin header
 * (non-browser clients, some same-origin requests) are allowed.
 */
export default function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) {
    return true;
  }

  // Prefer the proxy-set forwarded host: behind a host-rewriting proxy the
  // browser's Origin carries the external host while Host is internal.
  // Browsers never let cross-site pages set X-Forwarded-Host, so this does
  // not weaken the check.
  const host =
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    request.headers.get('host');

  // Next.js defaults x-forwarded-proto to 'http' when the proxy omits it, so
  // 'http' is not authoritative (a TLS-terminating proxy may sit in front).
  // Only an explicit 'https' is trusted, to block an http Origin downgrade.
  const proto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();

  try {
    const originUrl = new URL(origin);
    if (originUrl.host !== host) {
      return false;
    }
    return !(proto === 'https' && originUrl.protocol !== 'https:');
  } catch {
    return false;
  }
}
