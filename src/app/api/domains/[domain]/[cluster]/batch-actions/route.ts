import { type NextRequest } from 'next/server';

import { listBatchActions } from '@/route-handlers/list-batch-actions/list-batch-actions';
import type { RouteParams } from '@/route-handlers/list-batch-actions/list-batch-actions.types';
import { startBatchAction } from '@/route-handlers/start-batch-action/start-batch-action';
import type { RouteParams as StartBatchActionRouteParams } from '@/route-handlers/start-batch-action/start-batch-action.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: Promise<RouteParams> }
) {
  return routeHandlerWithMiddlewares(
    listBatchActions,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}

export async function POST(
  request: NextRequest,
  options: { params: Promise<StartBatchActionRouteParams> }
) {
  return routeHandlerWithMiddlewares(
    startBatchAction,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
