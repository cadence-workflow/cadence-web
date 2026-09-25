import { type NextRequest } from 'next/server';

/** True when the client used HTTPS. Uses x-forwarded-proto when a proxy set it. */
export default function getCookieSecureAttribute(request: NextRequest) {
  const xfProto = request.headers.get('x-forwarded-proto');
  const proto = xfProto?.split(',')[0]?.trim().toLowerCase();
  if (proto) return proto === 'https';
  return request.nextUrl.protocol === 'https:';
}
