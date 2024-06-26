import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import * as grpcClient from '@/utils/grpc/grpc-client';

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
  } catch (e: any) {
    // TODO: improve error formatting when we have a GRPC error type
    return NextResponse.json(
      {
        error: 'Error fetching domain info',
        message: e.toString(),
      },
      { status: e.httpStatusCode ?? 500 }
    );
  }
}
