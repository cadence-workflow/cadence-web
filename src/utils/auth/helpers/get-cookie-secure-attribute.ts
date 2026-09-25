import { type NextRequest } from 'next/server';

/**
 * @param request - The Next.js request object
 * @returns True if the client used HTTPS, false otherwise
 */
export default function getCookieSecureAttribute(request: NextRequest) {
  const xfProto = request.headers.get('x-forwarded-proto');
  const proto = xfProto?.split(',')[0]?.trim().toLowerCase();
  if (proto) return proto === 'https';
  return request.nextUrl.protocol === 'https:';
}
