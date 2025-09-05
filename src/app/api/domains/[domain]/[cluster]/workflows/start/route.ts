import { type NextRequest } from 'next/server';

import { startWorkflow } from '@/route-handlers/start-workflow/start-workflow';
import { type StartWorkflowRequestParams } from '@/route-handlers/start-workflow/start-workflow.types';
import { routeHandlerWithMiddlewares } from '@/utils/route-handlers-middleware';
import routeHandlersDefaultMiddlewares from '@/utils/route-handlers-middleware/config/route-handlers-default-middlewares.config';

export async function POST(
  request: NextRequest,
  options: { params: StartWorkflowRequestParams }
) {
  return routeHandlerWithMiddlewares(
    startWorkflow,
    request,
    options,
    routeHandlersDefaultMiddlewares
  );
}
