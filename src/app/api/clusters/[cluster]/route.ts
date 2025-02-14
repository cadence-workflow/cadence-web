import { type NextRequest } from 'next/server';

import { describeCluster } from '@/route-handlers/describe-cluster/describe-cluster';
import type { RouteParams } from '@/route-handlers/describe-domain/describe-domain.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    describeCluster,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
