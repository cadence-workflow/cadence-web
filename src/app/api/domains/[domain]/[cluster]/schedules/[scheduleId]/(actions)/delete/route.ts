import { type NextRequest } from 'next/server';

import { deleteSchedule } from '@/route-handlers/delete-schedule/delete-schedule';
import { type RouteParams } from '@/route-handlers/delete-schedule/delete-schedule.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function POST(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    deleteSchedule,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
