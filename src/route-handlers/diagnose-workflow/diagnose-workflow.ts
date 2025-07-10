import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';
import { retry } from '@/utils/retry';

import parseQueryResult from '../query-workflow/helpers/parse-query-result';

import {
  DIAGNOSTICS_NOT_COMPLETED_MSG,
  DIAGNOSTICS_WORKFLOW_QUERY,
} from './diagnose-workflow.constants';
import {
  type DiagnoseWorkflowResponse,
  type Context,
  type RequestParams,
} from './diagnose-workflow.types';

export async function diagnoseWorkflow(
  _: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const decodedParams = decodeUrlParams(requestParams.params);

  try {
    const { diagnosticWorkflowExecution } =
      await ctx.grpcClusterMethods.getDiagnosticsWorkflow({
        domain: decodedParams.domain,
        workflowExecution: {
          workflowId: decodedParams.workflowId,
          runId: decodedParams.runId,
        },
      });

    const res = await retry(
      () =>
        ctx.grpcClusterMethods.queryWorkflow({
          domain: decodedParams.domain,
          workflowExecution: diagnosticWorkflowExecution,
          query: {
            queryType: DIAGNOSTICS_WORKFLOW_QUERY,
          },
          queryRejectCondition: 'QUERY_REJECT_CONDITION_NOT_COMPLETED_CLEANLY',
        }),
      {
        shouldRetry: (error) =>
          error instanceof Error &&
          error.message.includes(DIAGNOSTICS_NOT_COMPLETED_MSG),
      }
    );

    if (res.queryRejected) {
      return NextResponse.json(
        {
          message: 'Query to Diagnostics Workflow rejected',
          cause: res.queryRejected,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      result: res.queryResult ? parseQueryResult(res.queryResult) : null,
    } satisfies DiagnoseWorkflowResponse);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, error: e },
      'Error diagnosing workflow'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error diagnosing workflow',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
