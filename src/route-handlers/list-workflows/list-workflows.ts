import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import * as grpcClient from '@/utils/grpc/grpc-client';

import getListWorkflowExecutionsQuery from './helpers/get-list-workflow-executions-query';
import mapExecutionsToWorkflows from './helpers/map-executions-to-workflows';
import type {
  ListWorkflowsResponse,
  RequestParams,
  RouteParams,
} from './list-workflows.types';
import listWorkflowsQueryParamSchema from './schemas/list-workflows-query-params-schema';

export async function listWorkflows(
  request: NextRequest,
  requestParams: RequestParams
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
    const res = await grpcClient.clusterMethods[
      decodedParams.cluster
    ].listWorkflows({
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
  } catch (e: any) {
    return NextResponse.json(
      {
        message: 'Failed to fetch workflows',
      },
      {
        // TODO @adhitya.mamallan - Use the GRPCError type once it is available
        status: e.httpStatusCode ?? 500,
      }
    );
  }
}
