import { type NextRequest, NextResponse } from 'next/server';
import queryString from 'query-string';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';
import { BATCH_ACTION_BATCHER_DOMAIN } from '@/views/domain-batch-actions/domain-batch-actions.constants';

import getBatchActionFromWorkflow from './helpers/get-batch-action-from-workflow';
import getBatchActionsListQuery from './helpers/get-batch-actions-list-query';
import type {
  Context,
  ListBatchActionsResponse,
  RequestParams,
  RouteParams,
} from './list-batch-actions.types';
import listBatchActionsQueryParamsSchema from './schemas/list-batch-actions-query-params-schema';

export async function listBatchActions(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const params = requestParams.params as RouteParams;

  const { data: queryParams, error } =
    listBatchActionsQueryParamsSchema.safeParse(
      queryString.parse(request.nextUrl.searchParams.toString())
    );

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid argument(s) for listing batch actions',
        validationErrors: error.errors,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const res = await ctx.grpcClusterMethods.listWorkflows({
      domain: BATCH_ACTION_BATCHER_DOMAIN,
      pageSize: queryParams.pageSize,
      nextPageToken: queryParams.nextPage,
      query: getBatchActionsListQuery({ domain: params.domain }),
    });

    const batchActions = res.executions.flatMap((execution) => {
      const batchAction = getBatchActionFromWorkflow(execution);
      return batchAction ? [batchAction] : [];
    });

    const response: ListBatchActionsResponse = {
      batchActions,
      nextPageToken: res.nextPageToken,
    };

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, queryParams, error: e },
      'Error fetching batch actions' +
        (e instanceof GRPCError ? ': ' + e.message : '')
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error fetching batch actions',
        cause: e,
      },
      {
        status: getHTTPStatusCode(e),
      }
    );
  }
}
