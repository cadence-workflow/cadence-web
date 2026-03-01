import { type NextRequest } from 'next/server';

import { getTaskListsByDomain } from '@/route-handlers/get-task-lists-by-domain/get-task-lists-by-domain';
import { type RouteParams } from '@/route-handlers/get-task-lists-by-domain/get-task-lists-by-domain.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    getTaskListsByDomain,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
