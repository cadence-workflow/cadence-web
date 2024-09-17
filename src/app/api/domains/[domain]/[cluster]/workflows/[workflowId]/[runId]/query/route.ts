import { type NextRequest } from 'next/server';

import fetchWorkflowQueryTypes from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types';
import { type RouteParams } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  return fetchWorkflowQueryTypes(request, { params });
}
