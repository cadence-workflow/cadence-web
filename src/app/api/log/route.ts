import { type NextRequest } from 'next/server';

import { logToServer } from '@/route-handlers/log-to-server/log-to-server';

export async function POST(request: NextRequest) {
  return logToServer(request);
}
