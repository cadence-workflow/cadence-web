import { type NextRequest, NextResponse } from 'next/server';

import { type ListOpenWorkflowExecutionsRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListOpenWorkflowExecutionsRequest';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import mapExecutionsToWorkflows from '../list-workflows/helpers/map-executions-to-workflows';

import type {
  Context,
  ListWorkflowsBasicResponse,
  RequestParams,
  RouteParams,
} from './list-workflows-basic.types';
import listWorkflowsBasicQueryParamsSchema from './schemas/list-workflows-basic-query-params-schema';

export async function listWorkflowsBasic(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const params = requestParams.params as RouteParams;

  const { data: queryParams, error } =
    listWorkflowsBasicQueryParamsSchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid argument(s) for workflow listing',
        validationErrors: error.errors,
      },
      {
        status: 400,
      }
    );
  }

  const baseParams = {
    domain: params.domain,
    pageSize: queryParams.pageSize,
    nextPageToken: queryParams.nextPage,
    startTimeFilter: {
      earliestTime: queryParams.timeRangeStart,
      latestTime: queryParams.timeRangeEnd,
    },
    ...((queryParams.workflowId || queryParams.runId) && {
      filters: 'executionFilter',
      executionFilter: {
        workflowId: queryParams.workflowId,
        runId: queryParams.runId,
      },
    }),
    ...(queryParams.workflowType && {
      filters: 'typeFilter',
      typeFilter: {
        name: queryParams.workflowType,
      },
    }),
  } satisfies ListOpenWorkflowExecutionsRequest__Input;

  try {
    const res =
      queryParams.kind === 'closed'
        ? await ctx.grpcClusterMethods.closedWorkflows({
            ...baseParams,
            ...(queryParams.closeStatus && {
              filters: 'statusFilter',
              statusFilter: {
                status: queryParams.closeStatus,
              },
            }),
          })
        : await ctx.grpcClusterMethods.openWorkflows({ ...baseParams });

    const response: ListWorkflowsBasicResponse = {
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
