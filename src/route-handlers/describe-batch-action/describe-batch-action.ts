import { type NextRequest, NextResponse } from 'next/server';

import { BATCH_ACTION_BATCHER_DOMAIN } from '@/route-handlers/list-batch-actions/list-batch-actions.constants';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type BatchActionProgressResult,
  type Context,
  type DescribeBatchActionResponse,
  type RequestParams,
} from './describe-batch-action.types';
import getBatchActionDetailFromWorkflow from './helpers/get-batch-action-detail-from-workflow';
import getBatchActionInputFromHistory from './helpers/get-batch-action-input-from-history';
import {
  getFinalProgressFromCloseEvent,
  getRunningProgressFromDescribe,
} from './helpers/get-batch-action-progress';

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

    let progressResult: BatchActionProgressResult = {};

    if (detail.status === 'RUNNING' || detail.status === 'FAILED') {
      // RUNNING: live activity heartbeat. FAILED: only a workflow-level timeout
      // keeps the activity (and its last heartbeat) on the describe response;
      // a missing heartbeat just means no progress.
      progressResult = getRunningProgressFromDescribe(describeResponse);
    } else if (detail.status === 'COMPLETED') {
      // Final counts live in the close event; reading them is best-effort.
      try {
        const closeEventResponse = await ctx.grpcClusterMethods.getHistory({
          domain: BATCH_ACTION_BATCHER_DOMAIN,
          workflowExecution,
          historyEventFilterType: 'EVENT_FILTER_TYPE_CLOSE_EVENT',
        });
        progressResult = getFinalProgressFromCloseEvent(
          closeEventResponse.history?.events?.[0]
        );
      } catch (e) {
        progressResult = { progressError: true };
        logger.error<RouteHandlerErrorPayload>(
          { requestParams: params, error: e },
          'Failed to read batch action progress from close event'
        );
      }
    }

    const response = {
      ...detail,
      ...getBatchActionInputFromHistory(historyResponse),
      ...progressResult,
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
