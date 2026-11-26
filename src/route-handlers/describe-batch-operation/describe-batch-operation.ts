import { type NextRequest, NextResponse } from 'next/server';

import { getHTTPStatusCode, isGRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type Context,
  type DescribeBatchOperationResponse,
  type RequestParams,
} from './describe-batch-operation.types';

export async function describeBatchOperation(
  _: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const params = requestParams.params;

  try {
    const response: DescribeBatchOperationResponse =
      await ctx.grpcClusterMethods.describeBatchOperation({
        domain: params.domain,
        batchId: params.batchId,
      });

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error describing batch operation' +
        (isGRPCError(e) ? ': ' + e.message : '')
    );

    return NextResponse.json(
      {
        message: isGRPCError(e)
          ? e.message
          : 'Error describing batch operation',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
