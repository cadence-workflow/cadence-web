import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import signalWorkflowRequestBodySchema from './schemas/signal-workflow-request-body-schema';
import { type Context, type RequestParams } from './signal-workflow.types';

export async function signalWorkflow(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const requestBody = await request.json();
  const { data, error } =
    signalWorkflowRequestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for workflow signal',
        validationErrors: error.errors,
      },
      { status: 400 }
    );
  }

  const decodedParams = decodeUrlParams(requestParams.params);

  try {
    const response = await ctx.grpcClusterMethods.signalWorkflow({
      domain: decodedParams.domain,
      workflowExecution: {
        workflowId: decodedParams.workflowId,
        runId: decodedParams.runId,
      },
      signalName: data.signalName,
      signalInput: data.signalInput
        ? { data: Buffer.from(data.signalInput) }
        : undefined,
      identity: ctx.userInfo?.id,
    });

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, error: e },
      'Error signaling workflow'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error signaling workflow',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
