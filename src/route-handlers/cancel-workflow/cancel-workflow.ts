import { type NextRequest, NextResponse } from 'next/server';

import { getHTTPStatusCode, isGRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type CancelWorkflowResponse,
  type Context,
  type RequestParams,
} from './cancel-workflow.types';
import cancelWorkflowRequestBodySchema from './schemas/cancel-workflow-request-body-schema';

export async function cancelWorkflow(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const requestBody = await request.json();
  const { data, error } =
    cancelWorkflowRequestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for workflow cancellation',
        validationErrors: error.issues,
      },
      { status: 400 }
    );
  }

  const params = requestParams.params;

  try {
    await ctx.grpcClusterMethods.requestCancelWorkflow({
      domain: params.domain,
      workflowExecution: {
        workflowId: params.workflowId,
        runId: params.runId,
      },
      cause: data.cause,
      identity: ctx.userInfo?.id,
    });

    return NextResponse.json({} satisfies CancelWorkflowResponse);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error cancelling workflow'
    );

    return NextResponse.json(
      {
        message: isGRPCError(e) ? e.message : 'Error cancelling workflow',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
