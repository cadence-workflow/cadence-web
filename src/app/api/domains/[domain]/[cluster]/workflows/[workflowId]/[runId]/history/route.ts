import { type NextRequest } from 'next/server';

import getWorkflowHistory from '@/route-handlers/get-workflow-history/get-workflow-history';
import { type RouteParams } from '@/route-handlers/get-workflow-history/get-workflow-history.types';

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  return getWorkflowHistory(request, { params });
}
