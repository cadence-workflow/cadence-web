import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
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
  const decodedParams = decodeUrlParams(requestParams.params) as RouteParams;

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

  try {
    const listEndpoint =
      queryParams.kind === 'open'
        ? ctx.grpcClusterMethods.openWorkflows
        : ctx.grpcClusterMethods.closedWorkflows;

    const res = await listEndpoint({
      domain: decodedParams.domain,
      pageSize: queryParams.pageSize,
      nextPageToken: queryParams.nextPage,
      startTimeFilter: {
        earliestTime: queryParams.timeRangeStart,
        latestTime: queryParams.timeRangeEnd,
      },
      executionFilter: {
        workflowId: queryParams.workflowId,
        runId: queryParams.runId,
      },
      typeFilter: {
        name: queryParams.workflowType,
      },
      ...(queryParams.kind === 'closed' && {
        statusFilter: {
          status: queryParams.closeStatus,
        },
      }),
    });

    const response: ListWorkflowsBasicResponse = {
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
