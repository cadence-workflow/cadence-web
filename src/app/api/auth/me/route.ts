import { type NextRequest } from 'next/server';

import { getAuthMe } from '@/route-handlers/auth-me/get-auth-me';

export async function GET(request: NextRequest) {
  return getAuthMe(request);
}
