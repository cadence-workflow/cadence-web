import { NextResponse, type NextRequest } from 'next/server';

import {
  getPublicAuthContext,
  resolveAuthContext,
} from '@/utils/auth/auth-context';

export async function GET(request: NextRequest) {
  const authContext = await resolveAuthContext({
    cookies: request.cookies,
    headers: request.headers,
  });
  return NextResponse.json(getPublicAuthContext(authContext), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
