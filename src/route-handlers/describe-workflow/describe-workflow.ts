import { NextResponse, type NextRequest } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import { type RequestParams } from './describe-workflow.types';

export default async function describeWorkflow(
  _: NextRequest,
  requestParams: RequestParams
) {
  const decodedParams = decodeUrlParams(requestParams.params);

  try {
    const res = await grpcClient.clusterMethods[
      decodedParams.cluster
    ].describeWorkflow({
      domain: decodedParams.domain,
      workflowExecution: {
        workflowId: decodedParams.workflowId,
        runId: decodedParams.runId,
      },
    });

    return NextResponse.json(res);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, cause: e },
      'Error fetching workflow info'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error fetching workflow info',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
