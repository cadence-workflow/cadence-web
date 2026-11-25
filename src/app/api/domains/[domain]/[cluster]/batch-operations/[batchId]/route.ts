import { type NextRequest } from 'next/server';

import { describeBatchOperation } from '@/route-handlers/describe-batch-operation/describe-batch-operation';
import type { RouteParams } from '@/route-handlers/describe-batch-operation/describe-batch-operation.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function GET(
  request: NextRequest,
  options: { params: Promise<RouteParams> }
) {
  return routeHandlerWithMiddlewares(
    describeBatchOperation,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
