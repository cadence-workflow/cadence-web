import { type NextRequest } from 'next/server';

import { listWorkflows } from '@/route-handlers/list-workflows/list-workflows';
import type { RouteParams } from '@/route-handlers/list-workflows/list-workflows.types';

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  return listWorkflows(request, { params });
}
