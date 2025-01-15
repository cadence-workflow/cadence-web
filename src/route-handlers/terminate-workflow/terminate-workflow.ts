import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import terminateWorkflowRequestBodySchema from './schemas/terminate-workflow-request-body-schema';
import {
  type TerminateWorkflowResponse,
  type Context,
  type RequestParams,
} from './terminate-workflow.types';

export async function terminateWorkflow(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const requestBody = await request.json();
  const { data, error } =
    terminateWorkflowRequestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for workflow termination',
        validationErrors: error.errors,
      },
      { status: 400 }
    );
  }

  const decodedParams = decodeUrlParams(requestParams.params);

  try {
    await ctx.grpcClusterMethods.terminateWorkflow({
      domain: decodedParams.domain,
      workflowExecution: {
        workflowId: decodedParams.workflowId,
        runId: decodedParams.runId,
      },
      reason: data.reason,
    });

    return NextResponse.json({} satisfies TerminateWorkflowResponse);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, cause: e },
      'Error terminating workflow'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error terminating workflow',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
