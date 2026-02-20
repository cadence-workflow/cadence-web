import { type NextRequest, NextResponse } from 'next/server';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import { type Context, type RequestParams } from './reset-workflow.types';
import resetWorkflowRequestBodySchema from './schemas/reset-workflow-request-body-schema';

export async function resetWorkflow(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const requestBody = await request.json();
  const { data, error } = resetWorkflowRequestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for workflow reset',
        validationErrors: error.errors,
      },
      { status: 400 }
    );
  }

  const params = requestParams.params;

  try {
    const response = await ctx.grpcClusterMethods.resetWorkflow({
      domain: params.domain,
      workflowExecution: {
        workflowId: params.workflowId,
        runId: params.runId,
      },
      reason: data.reason,
      decisionFinishEventId: data.decisionFinishEventId,
      requestId: data.requestId,
      skipSignalReapply: data.skipSignalReapply,
    });

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error resetting workflow'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error resetting workflow',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
