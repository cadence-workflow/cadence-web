import { type NextRequest } from 'next/server';

export default function getCookieSecureAttribute(request: NextRequest) {
  const xfProto = request.headers.get('x-forwarded-proto');
  const proto = xfProto?.split(',')[0]?.trim().toLowerCase();
  if (proto) return proto === 'https';
  return request.nextUrl.protocol === 'https:';
}
