import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type Context,
  type QueryWorkflowResponse,
  type RequestParams,
} from './query-workflow.types';
import validQueryInputSchema from './schemas/valid-query-input-schema';

export async function queryWorkflow(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const requestBody = await request.text();
  const { data: queryInput, error } =
    validQueryInputSchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid JSON input provided for workflow querying',
      },
      { status: 400 }
    );
  }

  const decodedParams = decodeUrlParams(requestParams.params);

  try {
    const res = await ctx.grpcClusterMethods.queryWorkflow({
      domain: decodedParams.domain,
      workflowExecution: {
        workflowId: decodedParams.workflowId,
        runId: decodedParams.runId,
      },
      query: {
        queryType: decodedParams.queryName,
        queryArgs: {
          data: Buffer.from(queryInput),
        },
      },
    });

    return NextResponse.json({
      result: res.queryResult
        ? JSON.parse(
            Buffer.from(res.queryResult.data, 'base64').toString('utf-8')
          )
        : null,
      rejected: res.queryRejected,
    } satisfies QueryWorkflowResponse);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, cause: e },
      'Error querying workflow'
    );

    return NextResponse.json(
      {
        message: e instanceof GRPCError ? e.message : 'Error querying workflow',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
