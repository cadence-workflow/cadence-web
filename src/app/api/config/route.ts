import { type NextRequest } from 'next/server';

import getConfig from '@/route-handlers/get-config/get-config';

export async function GET(request: NextRequest) {
  return getConfig(request);
}
