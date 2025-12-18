import { NextResponse, type NextRequest } from 'next/server';

import { CADENCE_AUTH_COOKIE_NAME } from '@/utils/auth/auth-context';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
};

function getCookieSecureAttribute(request: NextRequest) {
  const xfProto = request.headers.get('x-forwarded-proto');
  const proto = xfProto?.split(',')[0]?.trim().toLowerCase();
  if (proto) return proto === 'https';
  return request.nextUrl.protocol === 'https:';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body?.token || typeof body.token !== 'string') {
      return NextResponse.json(
        { message: 'A valid token is required' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const normalizedToken = body.token.trim().replace(/^bearer\s+/i, '');
    if (!normalizedToken) {
      return NextResponse.json(
        { message: 'A valid token is required' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const response = NextResponse.json({ ok: true });
    response.headers.set('Cache-Control', 'no-store');
    response.cookies.set(CADENCE_AUTH_COOKIE_NAME, normalizedToken, {
      ...COOKIE_OPTIONS,
      secure: getCookieSecureAttribute(request),
    });
    return response;
  } catch {
    return NextResponse.json(
      { message: 'Invalid request body' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  response.headers.set('Cache-Control', 'no-store');
  response.cookies.set(CADENCE_AUTH_COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    secure: getCookieSecureAttribute(request),
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}
