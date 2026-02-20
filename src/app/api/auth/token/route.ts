import { NextResponse, type NextRequest } from 'next/server';

import { CADENCE_AUTH_COOKIE_NAME } from '@/utils/auth/auth-context';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
};

const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

const badRequest = (message: string) =>
  NextResponse.json(
    { message },
    { status: 400, headers: { 'Cache-Control': 'no-store' } }
  );

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

function getCookieSecureAttribute(request: NextRequest) {
  const xfProto = request.headers.get('x-forwarded-proto');
  const proto = xfProto?.split(',')[0]?.trim().toLowerCase();
  if (proto) return proto === 'https';
  return request.nextUrl.protocol === 'https:';
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    if (!isRecord(body)) {
      return badRequest('Request body must be a JSON object');
    }

    if (!Object.hasOwn(body, 'token')) {
      return badRequest('Token is required');
    }

    if (typeof body.token !== 'string') {
      return badRequest('Token must be a string');
    }

    const normalizedToken = body.token.trim().replace(/^bearer\s+/i, '');
    if (!normalizedToken) {
      return badRequest('Token cannot be empty');
    }

    if (!JWT_PATTERN.test(normalizedToken)) {
      return badRequest(
        'Token must be a JWT in header.payload.signature format'
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
    return badRequest('Invalid request body');
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
