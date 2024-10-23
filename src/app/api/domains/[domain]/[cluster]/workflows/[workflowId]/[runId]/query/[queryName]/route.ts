import { type NextRequest } from 'next/server';

import { queryWorkflow } from '@/route-handlers/query-workflow/query-workflow';
import { type RouteParams } from '@/route-handlers/query-workflow/query-workflow.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function POST(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    queryWorkflow,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
