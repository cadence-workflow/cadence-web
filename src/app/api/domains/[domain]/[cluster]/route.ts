import { type NextRequest } from 'next/server';

import { describeDomain } from '@/route-handlers/describe-domain/describe-domain';
import type { RouteParams } from '@/route-handlers/describe-domain/describe-domain.types';

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  return describeDomain(request, { params });
}
