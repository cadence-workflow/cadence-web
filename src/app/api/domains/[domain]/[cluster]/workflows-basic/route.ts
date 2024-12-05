import { type NextRequest } from 'next/server';

import { listWorkflowsBasic } from '@/route-handlers/list-workflows-basic/list-workflows-basic';
import type { RouteParams } from '@/route-handlers/list-workflows-basic/list-workflows-basic.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    listWorkflowsBasic,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
