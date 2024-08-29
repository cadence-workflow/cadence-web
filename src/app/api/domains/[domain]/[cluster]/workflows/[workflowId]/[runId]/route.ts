import { type NextRequest } from 'next/server';

import describeWorkflow from '@/route-handlers/describe-workflow/describe-workflow';
import { type RouteParams } from '@/route-handlers/describe-workflow/describe-workflow.types';

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  return describeWorkflow(request, { params });
}
