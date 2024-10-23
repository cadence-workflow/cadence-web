import { type NextRequest } from 'next/server';

import describeWorkflow from '@/route-handlers/describe-workflow/describe-workflow';
import { type RouteParams } from '@/route-handlers/describe-workflow/describe-workflow.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    describeWorkflow,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
