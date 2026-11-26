import { type NextRequest, NextResponse } from 'next/server';
import queryString from 'query-string';

import { getHTTPStatusCode, isGRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type Context,
  type ListBatchOperationsResponse,
  type RequestParams,
} from './list-batch-operations.types';
import listBatchOperationsQueryParamsSchema from './schemas/list-batch-operations-query-params-schema';

export async function listBatchOperations(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const params = requestParams.params;

  const { data: queryParams, error } =
    listBatchOperationsQueryParamsSchema.safeParse(
      queryString.parse(request.nextUrl.searchParams.toString())
    );

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid argument(s) for listing batch operations',
        validationErrors: error.issues,
      },
      { status: 400 }
    );
  }

  try {
    const response: ListBatchOperationsResponse =
      await ctx.grpcClusterMethods.listBatchOperations({
        domain: params.domain,
        state: queryParams.state,
        pageSize: queryParams.pageSize,
        nextPageToken: queryParams.nextPage,
      });

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, queryParams, error: e },
      'Error fetching batch operations' +
        (isGRPCError(e) ? ': ' + e.message : '')
    );

    return NextResponse.json(
      {
        message: isGRPCError(e) ? e.message : 'Error fetching batch operations',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
