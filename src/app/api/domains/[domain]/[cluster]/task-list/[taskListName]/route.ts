import { type NextRequest } from 'next/server';

import { describeTaskList } from '@/route-handlers/describe-task-list/describe-task-list';
import { type RouteParams } from '@/route-handlers/describe-task-list/describe-task-list.types';

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  return describeTaskList(request, { params });
}
