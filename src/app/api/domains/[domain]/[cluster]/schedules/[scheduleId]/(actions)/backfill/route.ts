import { type NextRequest } from 'next/server';

import { backfillSchedule } from '@/route-handlers/backfill-schedule/backfill-schedule';
import { type RouteParams } from '@/route-handlers/backfill-schedule/backfill-schedule.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function POST(
  request: NextRequest,
  options: { params: RouteParams }
) {
  return routeHandlerWithMiddlewares(
    backfillSchedule,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
