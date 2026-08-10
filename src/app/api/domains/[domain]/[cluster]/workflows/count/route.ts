import { type NextRequest } from 'next/server';

import { countWorkflows } from '@/route-handlers/count-workflows/count-workflows';
import type { RouteParams } from '@/route-handlers/count-workflows/count-workflows.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    countWorkflows,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
