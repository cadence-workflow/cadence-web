import { NextResponse, type NextRequest } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type RouteParams,
  type RequestParams,
} from './get-workflow-history.types';
import getWorkflowHistoryQueryParamSchema from './schemas/get-workflow-history-query-params-schema';

export default async function getWorkflowHistory(
  request: NextRequest,
  requestParams: RequestParams
) {
  const decodedParams = decodeUrlParams<RouteParams>(requestParams.params);
  const { data: queryParams, error } =
    getWorkflowHistoryQueryParamSchema.safeParse(
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
    const res = await grpcClient.clusterMethods[
      decodedParams.cluster
    ].getHistory({
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
