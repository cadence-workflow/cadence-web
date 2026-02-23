import { type NextRequest, NextResponse } from 'next/server';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import { type Context, type RequestParams } from './restart-workflow.types';
import restartWorkflowRequestBodySchema from './schemas/restart-workflow-request-body-schema';

export async function restartWorkflow(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const requestBody = await request.json();
  const { data, error } =
    restartWorkflowRequestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for workflow restart',
        validationErrors: error.errors,
      },
      { status: 400 }
    );
  }

  const params = requestParams.params;

  try {
    const response = await ctx.grpcClusterMethods.restartWorkflow({
      domain: params.domain,
      workflowExecution: {
        workflowId: params.workflowId,
        runId: params.runId,
      },
      reason: data.reason,
      identity: ctx.userInfo?.id,
    });

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error restarting workflow'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error restarting workflow',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
