import { type NextRequest, NextResponse } from 'next/server';
import queryString from 'query-string';

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
  const params = requestParams.params as RouteParams;

  const { data: queryParams, error } = listWorkflowsQueryParamSchema.safeParse(
    queryString.parse(request.nextUrl.searchParams.toString())
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

  const listWorkflowsParams = {
    domain: params.domain,
    pageSize: queryParams.pageSize,
    nextPageToken: queryParams.nextPage,
    query:
      queryParams.inputType === 'query'
        ? queryParams.query
        : getListWorkflowExecutionsQuery({
            search: queryParams.search,
            workflowStatuses: queryParams.statuses,
            sortColumn: queryParams.sortColumn,
            sortOrder: queryParams.sortOrder,
            timeColumn: queryParams.timeColumn,
            timeRangeStart: queryParams.timeRangeStart,
            timeRangeEnd: queryParams.timeRangeEnd,
          }),
  };

  try {
    const res =
      queryParams.listType === 'archived'
        ? await ctx.grpcClusterMethods.archivedWorkflows(listWorkflowsParams)
        : await ctx.grpcClusterMethods.listWorkflows(listWorkflowsParams);

    const response: ListWorkflowsResponse = {
      workflows: mapExecutionsToWorkflows(res.executions),
      nextPage: res.nextPageToken,
    };

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, queryParams, error: e },
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
