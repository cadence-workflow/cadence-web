import { type NextRequest } from 'next/server';

/** Missing Origin is allowed; non-browser clients do not send one. */
export default function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) {
    return true;
  }

  const host =
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    request.headers.get('host');
  const forwardedProto = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim();

  try {
    const { host: originHost, protocol } = new URL(origin);
    // Next.js defaults x-forwarded-proto to "http" when the proxy omits it.
    const schemeDowngrade = forwardedProto === 'https' && protocol !== 'https:';
    return originHost === host && !schemeDowngrade;
  } catch {
    return false;
  }
}
