import { type NextRequest } from 'next/server';

import { signalWorkflow } from '@/route-handlers/signal-workflow/signal-workflow';
import { type RequestParams } from '@/route-handlers/signal-workflow/signal-workflow.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function POST(
  request: NextRequest,
  options: { params: RequestParams['params'] }
) {
  return routeHandlerWithMiddlewares(
    signalWorkflow,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
