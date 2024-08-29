import { NextResponse, type NextRequest } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import { type RequestParams } from './get-workflow-history.types';

export default async function getWorkflowHistory(
  _: NextRequest,
  requestParams: RequestParams
) {
  const decodedParams = decodeUrlParams(requestParams.params);

  try {
    const res = await grpcClient.clusterMethods[
      decodedParams.cluster
    ].getHistory({
      domain: decodedParams.domain,
      workflowExecution: {
        workflowId: decodedParams.workflowId,
        runId: decodedParams.runId,
      },
    });

    return Response.json(res);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, cause: e },
      'Error fetching workflow history'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError
            ? e.message
            : 'Error fetching workflow history',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
