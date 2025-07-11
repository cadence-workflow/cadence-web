import { type NextRequest } from 'next/server';

import { diagnoseWorkflow } from '@/route-handlers/diagnose-workflow/diagnose-workflow';
import { type RouteParams } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    diagnoseWorkflow,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
