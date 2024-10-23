import { type NextRequest } from 'next/server';

import { listWorkflows } from '@/route-handlers/list-workflows/list-workflows';
import type { RouteParams } from '@/route-handlers/list-workflows/list-workflows.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    listWorkflows,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
