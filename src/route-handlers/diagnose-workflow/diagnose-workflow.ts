import { status } from '@grpc/grpc-js';
import { type NextRequest, NextResponse } from 'next/server';
import pRetry from 'p-retry';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  DIAGNOSTICS_NOT_COMPLETED_MSG,
  DIAGNOSTICS_QUERY_RETRY_POLICY,
  DIAGNOSTICS_WORKFLOW_DOMAIN,
  DIAGNOSTICS_WORKFLOW_QUERY,
} from './diagnose-workflow.constants';
import {
  type DiagnoseWorkflowResponse,
  type Context,
  type RequestParams,
} from './diagnose-workflow.types';
import workflowDiagnosticsResultSchema from './schemas/workflow-diagnostics-result-schema';

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

    const unparsedResult = await pRetry(
      () =>
        ctx.grpcClusterMethods
          .queryWorkflow({
            domain: DIAGNOSTICS_WORKFLOW_DOMAIN,
            workflowExecution: diagnosticWorkflowExecution,
            query: {
              queryType: DIAGNOSTICS_WORKFLOW_QUERY,
            },
            queryRejectCondition:
              'QUERY_REJECT_CONDITION_NOT_COMPLETED_CLEANLY',
          })
          .then((value) => {
            if (!value.queryResult) {
              throw new GRPCError('Query to Diagnostics Workflow rejected', {
                grpcStatusCode: status.FAILED_PRECONDITION,
              });
            }

            const queryResultJson = JSON.parse(
              Buffer.from(value.queryResult.data, 'base64').toString('utf-8')
            );

            if (!queryResultJson.DiagnosticsCompleted) {
              throw new Error(DIAGNOSTICS_NOT_COMPLETED_MSG);
            }

            return queryResultJson;
          }),
      {
        ...DIAGNOSTICS_QUERY_RETRY_POLICY,
        shouldRetry: (error) => error.message === DIAGNOSTICS_NOT_COMPLETED_MSG,
      }
    );

    const { data: parsedResult, error } =
      workflowDiagnosticsResultSchema.safeParse(unparsedResult);

    return NextResponse.json(
      (error
        ? {
            result: unparsedResult,
            parsingError: error,
          }
        : {
            result: parsedResult,
            parsingError: null,
          }) satisfies DiagnoseWorkflowResponse
    );
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
