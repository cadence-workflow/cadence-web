import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import * as grpcClient from '@/utils/grpc/grpc-client';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import { type RequestParams, type RouteParams } from './describe-domain.types';

export async function describeDomain(
  _: NextRequest,
  requestParams: RequestParams
) {
  const decodedParams = decodeUrlParams(requestParams.params) as RouteParams;

  try {
    const res = await grpcClient
      .getClusterMethods(decodedParams.cluster)
      .describeDomain({ name: decodedParams.domain });

    return NextResponse.json(res.domain);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, cause: e },
      'Error fetching domain info'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error fetching domain info',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
