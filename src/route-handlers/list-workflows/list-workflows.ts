import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { getHTTPStatusCode } from '@/utils/grpc/grpc-error';

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
    const res = await grpcClient
      .getClusterMethods(decodedParams.cluster)
      .listWorkflows({
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
    return NextResponse.json(
      {
        message: 'Error fetching workflows',
        cause: e,
      },
      {
        status: getHTTPStatusCode(e),
      }
    );
  }
}
