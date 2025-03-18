import { type NextRequest } from 'next/server';

import { restartWorkflow } from '@/route-handlers/restart-workflow/restart-workflow';
import { type RouteParams } from '@/route-handlers/restart-workflow/restart-workflow.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function POST(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    restartWorkflow,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
