import { NextResponse, type NextRequest } from 'next/server';

import {
  getPublicAuthContext,
  resolveAuthContext,
} from '@/utils/auth/auth-context';

export async function GET(request: NextRequest) {
  const authContext = await resolveAuthContext(request.cookies);
  return NextResponse.json(getPublicAuthContext(authContext));
}
