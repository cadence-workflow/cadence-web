import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import getListWorkflowExecutionsQuery from './helpers/get-list-workflow-executions-query';
import mapExecutionsToWorkflows from './helpers/map-executions-to-workflows';
import type {
  Context,
  ListWorkflowsResponse,
  RequestParams,
  RouteParams,
} from './list-workflows.types';
import listWorkflowsQueryParamSchema from './schemas/list-workflows-query-params-schema';

export async function listWorkflows(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const decodedParams = decodeUrlParams(requestParams.params) as RouteParams;

  const { data: queryParams, error } = listWorkflowsQueryParamSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );
  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid argument(s) for workflow search',
        validationErrors: error.errors,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const res = await ctx.grpcClusterMethods.listWorkflows({
      domain: decodedParams.domain,
      pageSize: queryParams.pageSize,
      nextPageToken: queryParams.nextPage,
      query: getListWorkflowExecutionsQuery({
        search: queryParams.search,
        workflowStatus: queryParams.status,
        sortColumn: queryParams.sortColumn,
        sortOrder: queryParams.sortOrder,
        timeRangeStart: queryParams.timeRangeStart,
        timeRangeEnd: queryParams.timeRangeEnd,
      }),
    });

    const response: ListWorkflowsResponse = {
      workflows: mapExecutionsToWorkflows(res.executions),
      nextPage: res.nextPageToken,
    };

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, queryParams, cause: e },
      'Error fetching workflows' +
        (e instanceof GRPCError ? ': ' + e.message : '')
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error fetching workflows',
        cause: e,
      },
      {
        status: getHTTPStatusCode(e),
      }
    );
  }
}
