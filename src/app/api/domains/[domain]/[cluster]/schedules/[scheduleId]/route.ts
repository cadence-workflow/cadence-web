import { type NextRequest } from 'next/server';

import { describeSchedule } from '@/route-handlers/describe-schedule/describe-schedule';
import { type RouteParams } from '@/route-handlers/describe-schedule/describe-schedule.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    describeSchedule,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
