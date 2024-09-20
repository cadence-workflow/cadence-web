import { type NextRequest } from 'next/server';

import { queryWorkflow } from '@/route-handlers/query-workflow/query-workflow';
import { type RouteParams } from '@/route-handlers/query-workflow/query-workflow.types';

export async function POST(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  return queryWorkflow(request, { params });
}
