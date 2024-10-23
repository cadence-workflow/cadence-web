import { type NextRequest } from 'next/server';

import { describeTaskList } from '@/route-handlers/describe-task-list/describe-task-list';
import { type RouteParams } from '@/route-handlers/describe-task-list/describe-task-list.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    describeTaskList,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
