import { type NextRequest, NextResponse } from 'next/server';

import { BATCH_ACTION_BATCHER_DOMAIN } from '@/route-handlers/list-batch-actions/list-batch-actions.constants';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type Context,
  type DescribeBatchActionResponse,
  type RequestParams,
} from './describe-batch-action.types';
import getBatchActionDetailFromWorkflow from './helpers/get-batch-action-detail-from-workflow';
import getBatchActionInputFromHistory from './helpers/get-batch-action-input-from-history';

export async function describeBatchAction(
  _: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const params = requestParams.params;

  const workflowExecution = {
    workflowId: params.batchActionId,
    runId: '',
  };

  try {
    const [describeResponse, historyResponse] = await Promise.all([
      ctx.grpcClusterMethods.describeWorkflow({
        domain: BATCH_ACTION_BATCHER_DOMAIN,
        workflowExecution,
      }),
      ctx.grpcClusterMethods.getHistory({
        domain: BATCH_ACTION_BATCHER_DOMAIN,
        workflowExecution,
        pageSize: 1,
      }),
    ]);

    const detail = getBatchActionDetailFromWorkflow(describeResponse);
    if (!detail) {
      return NextResponse.json(
        { message: 'Batch action not found' },
        { status: 404 }
      );
    }

    const response = {
      ...detail,
      ...getBatchActionInputFromHistory(historyResponse),
    } satisfies DescribeBatchActionResponse;

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error fetching batch action' +
        (e instanceof GRPCError ? ': ' + e.message : '')
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error fetching batch action',
        cause: e,
      },
      {
        status: getHTTPStatusCode(e),
      }
    );
  }
}
