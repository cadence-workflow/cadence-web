import { type NextRequest } from 'next/server';

import { listSchedules } from '@/route-handlers/list-schedules/list-schedules';
import type { RouteParams } from '@/route-handlers/list-schedules/list-schedules.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    listSchedules,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
