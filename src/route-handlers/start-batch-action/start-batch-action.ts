import crypto from 'crypto';
import { type NextRequest, NextResponse } from 'next/server';

import { getHTTPStatusCode, isGRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import transformStartBatchActionBodyToGrpcInput from './helpers/transform-start-batch-action-body-to-grpc-input';
import startBatchActionRequestBodySchema from './schemas/start-batch-action-request-body-schema';
import {
  type Context,
  type RequestParams,
  type StartBatchActionResponse,
} from './start-batch-action.types';

export async function startBatchAction(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const requestBody = await request.json();
  const { data, error } =
    startBatchActionRequestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for batch action start',
        validationErrors: error.issues,
      },
      { status: 400 }
    );
  }

  const params = requestParams.params;

  try {
    // The route domain is the target domain the server checks write access on
    const response: StartBatchActionResponse =
      await ctx.grpcClusterMethods.startBatchOperation(
        transformStartBatchActionBodyToGrpcInput({
          domain: params.domain,
          batchId: data.batchId ?? crypto.randomUUID(),
          identity: ctx.userInfo?.id,
          body: data,
        })
      );

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error starting batch action'
    );

    return NextResponse.json(
      {
        message: isGRPCError(e) ? e.message : 'Error starting batch action',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
