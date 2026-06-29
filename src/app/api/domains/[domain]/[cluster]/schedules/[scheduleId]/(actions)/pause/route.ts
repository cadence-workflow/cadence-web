import { type NextRequest } from 'next/server';

import { pauseSchedule } from '@/route-handlers/pause-schedule/pause-schedule';
import { type RouteParams } from '@/route-handlers/pause-schedule/pause-schedule.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function POST(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    pauseSchedule,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
