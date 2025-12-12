import { NextResponse, type NextRequest } from 'next/server';

import { CADENCE_AUTH_COOKIE_NAME } from '@/utils/auth/auth-context';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development',
  sameSite: 'lax' as const,
  path: '/',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body?.token || typeof body.token !== 'string') {
      return NextResponse.json(
        { message: 'A valid token is required' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(CADENCE_AUTH_COOKIE_NAME, body.token, COOKIE_OPTIONS);
    return response;
  } catch {
    return NextResponse.json(
      { message: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CADENCE_AUTH_COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}
