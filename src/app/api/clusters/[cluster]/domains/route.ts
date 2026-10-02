import { type NextRequest } from 'next/server';

import { listDomains } from '@/route-handlers/list-domains/list-domains';
import { type RouteParams } from '@/route-handlers/list-domains/list-domains.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    listDomains,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
