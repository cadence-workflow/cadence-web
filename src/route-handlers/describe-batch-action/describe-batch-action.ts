import { type NextRequest, NextResponse } from 'next/server';

import { BATCH_ACTION_BATCHER_DOMAIN } from '@/route-handlers/list-batch-actions/list-batch-actions.constants';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type Context,
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
    const [describeResult, historyResult] = await Promise.allSettled([
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

    if (describeResult.status === 'rejected') {
      throw describeResult.reason;
    }

    const detail = getBatchActionDetailFromWorkflow(describeResult.value);
    if (!detail) {
      return NextResponse.json(
        { message: 'Batch action not found' },
        { status: 404 }
      );
    }

    if (historyResult.status === 'rejected') {
      // Enrichment is non-fatal — log and continue with describe-only data.
      logger.error<RouteHandlerErrorPayload>(
        { requestParams: params, error: historyResult.reason },
        'Failed to read batch action input from history'
      );
      return NextResponse.json(detail);
    }

    return NextResponse.json({
      ...detail,
      ...getBatchActionInputFromHistory(historyResult.value),
    });
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
