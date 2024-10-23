import { type NextRequest } from 'next/server';

import { describeDomain } from '@/route-handlers/describe-domain/describe-domain';
import type { RouteParams } from '@/route-handlers/describe-domain/describe-domain.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    describeDomain,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
