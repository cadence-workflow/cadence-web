import omit from 'lodash/omit';
import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type DescribeClusterResponse,
  type Context,
  type RequestParams,
  type RouteParams,
} from './describe-cluster.types';

export async function describeCluster(
  _: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const decodedParams = decodeUrlParams(requestParams.params) as RouteParams;

  // temporary solution to disable invoking describeCluster
  if (process.env.CADENCE_ADVANCED_VISIBILITY) {
    const res = {
      persistenceInfo: {
        visibilityStore: {
          features: [
            {
              key: 'advancedVisibilityEnabled',
              enabled: process.env.CADENCE_ADVANCED_VISIBILITY === 'true',
            },
          ],
        },
      },
      supportedClientVersions: null,
    };
    return NextResponse.json(res);
  }

  try {
    const res = await ctx.grpcClusterMethods.describeCluster({
      name: decodedParams.cluster,
    });

    const sanitizedRes: DescribeClusterResponse = omit(res, 'membershipInfo'); // No need to return host information to client

    return NextResponse.json(sanitizedRes);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, cause: e },
      'Error fetching cluster info'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error fetching cluster info',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
