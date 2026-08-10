import { type NextRequest, NextResponse } from 'next/server';
import queryString from 'query-string';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import type {
  Context,
  ListSchedulesResponse,
  RequestParams,
  RouteParams,
} from './list-schedules.types';
import listSchedulesQueryParamsSchema from './schemas/list-schedules-query-params-schema';

export async function listSchedules(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const params = requestParams.params as RouteParams;

  const { data: queryParams, error } = listSchedulesQueryParamsSchema.safeParse(
    queryString.parse(request.nextUrl.searchParams.toString())
  );

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid argument(s) for listing schedules',
        validationErrors: error.errors,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const response: ListSchedulesResponse =
      await ctx.grpcClusterMethods.listSchedules({
        domain: params.domain,
        pageSize: queryParams.pageSize,
        nextPageToken: queryParams.nextPage,
      });

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, queryParams, error: e },
      'Error fetching schedules' +
        (e instanceof GRPCError ? ': ' + e.message : '')
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error fetching schedules',
        cause: e,
      },
      {
        status: getHTTPStatusCode(e),
      }
    );
  }
}
