import { type NextRequest, NextResponse } from 'next/server';
import queryString from 'query-string';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import type {
  ListFailoverHistoryResponse,
  Context,
  RequestParams,
  RouteParams,
} from './list-failover-history.types';
import listFailoverHistoryQueryParamsSchema from './schemas/list-failover-history-query-params-schema';

export async function listFailoverHistory(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const decodedParams = decodeUrlParams(requestParams.params) as RouteParams;

  const { data: queryParams, error } =
    listFailoverHistoryQueryParamsSchema.safeParse(
      queryString.parse(request.nextUrl.searchParams.toString())
    );

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid argument(s) for fetching failover history',
        validationErrors: error.errors,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const response: ListFailoverHistoryResponse =
      await ctx.grpcClusterMethods.listFailoverHistory({
        filters: {
          domainId: queryParams.domainId,
        },
        pagination: {
          nextPageToken: queryParams.nextPage,
        },
      });

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, queryParams, error: e },
      'Error fetching failover history' +
        (e instanceof GRPCError ? ': ' + e.message : '')
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError
            ? e.message
            : 'Error fetching failover history',
        cause: e,
      },
      {
        status: getHTTPStatusCode(e),
      }
    );
  }
}
