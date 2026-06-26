import { type NextRequest } from 'next/server';

import { unpauseSchedule } from '@/route-handlers/unpause-schedule/unpause-schedule';
import { type RouteParams } from '@/route-handlers/unpause-schedule/unpause-schedule.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function POST(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    unpauseSchedule,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
