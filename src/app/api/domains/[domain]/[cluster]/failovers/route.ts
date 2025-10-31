import { type NextRequest } from 'next/server';

import { listFailoverHistory } from '@/route-handlers/list-failover-history/list-failover-history';
import { type RouteParams } from '@/route-handlers/list-failover-history/list-failover-history.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    listFailoverHistory,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
