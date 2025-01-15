import { type NextRequest } from 'next/server';

import { terminateWorkflow } from '@/route-handlers/terminate-workflow/terminate-workflow';
import { type RouteParams } from '@/route-handlers/terminate-workflow/terminate-workflow.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function POST(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    terminateWorkflow,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
