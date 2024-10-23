import { NextResponse, type NextRequest } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type RouteParams,
  type RequestParams,
  type Context,
} from './get-workflow-history.types';
import getWorkflowHistoryQueryParamsSchema from './schemas/get-workflow-history-query-params-schema';

export default async function getWorkflowHistory(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const decodedParams = decodeUrlParams<RouteParams>(requestParams.params);
  const { data: queryParams, error } =
    getWorkflowHistoryQueryParamsSchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid query param(s)',
        validationErrors: error.errors,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const res = await ctx.grpcClusterMethods.getHistory({
      domain: decodedParams.domain,
      workflowExecution: {
        workflowId: decodedParams.workflowId,
        runId: decodedParams.runId,
      },
      pageSize: queryParams.pageSize,
      waitForNewEvent: queryParams.waitForNewEvent,
      nextPageToken: queryParams.nextPage,
    });

    return Response.json(res);
  } catch (e) {
    if (
      e instanceof GRPCError &&
      e.message ===
        'Requested workflow history not found, may have passed retention period.'
    ) {
      return NextResponse.json(
        {
          message: 'Workflow not found',
          cause: e,
        },
        { status: 404 }
      );
    }

    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, cause: e },
      'Error fetching workflow history'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError
            ? e.message
            : 'Error fetching workflow history',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
