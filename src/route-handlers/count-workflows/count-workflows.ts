import { type NextRequest, NextResponse } from 'next/server';
import queryString from 'query-string';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';
import getVisibilityQuery from '@/utils/visibility/get-visibility-query';

import type {
  Context,
  CountWorkflowsResponse,
  RequestParams,
  RouteParams,
} from './count-workflows.types';
import countWorkflowsQueryParamSchema from './schemas/count-workflows-query-params-schema';

export async function countWorkflows(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const params = requestParams.params as RouteParams;

  const { data: queryParams, error } = countWorkflowsQueryParamSchema.safeParse(
    queryString.parse(request.nextUrl.searchParams.toString())
  );
  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid argument(s) for workflow count',
        validationErrors: error.errors,
      },
      {
        status: 400,
      }
    );
  }

  const query =
    queryParams.inputType === 'query'
      ? queryParams.query
      : getVisibilityQuery({
          search: queryParams.search,
          workflowStatuses: queryParams.statuses,
          sortColumn: queryParams.sortColumn,
          sortOrder: queryParams.sortOrder,
          timeColumn: queryParams.timeColumn,
          timeRangeStart: queryParams.timeRangeStart,
          timeRangeEnd: queryParams.timeRangeEnd,
          includeOrderBy: false,
        });

  try {
    const res = await ctx.grpcClusterMethods.countWorkflows({
      domain: params.domain,
      query,
    });

    const response: CountWorkflowsResponse = {
      count: parseInt(res.count, 10),
    };

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, queryParams, error: e },
      'Error counting workflows' +
        (e instanceof GRPCError ? ': ' + e.message : '')
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error counting workflows',
        cause: e,
      },
      {
        status: getHTTPStatusCode(e),
      }
    );
  }
}
