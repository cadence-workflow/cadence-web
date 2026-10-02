import { type NextRequest } from 'next/server';

import { handleAuthRecover } from '@/route-handlers/auth-recover/auth-recover';

export async function POST(request: NextRequest) {
  return handleAuthRecover(request);
}
