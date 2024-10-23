import { type NextRequest } from 'next/server';

import getWorkflowHistory from '@/route-handlers/get-workflow-history/get-workflow-history';
import { type RouteParams } from '@/route-handlers/get-workflow-history/get-workflow-history.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    getWorkflowHistory,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
