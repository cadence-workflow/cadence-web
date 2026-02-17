import { type NextRequest, NextResponse } from 'next/server';

import decodeUrlParams from '@/utils/decode-url-params';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type RequestParams,
  type RouteParams,
  type Context,
} from './get-task-lists-by-domain.types';

export async function getTaskListsByDomain(
  _: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const decodedParams = decodeUrlParams(requestParams.params) as RouteParams;

  try {
    const response = await ctx.grpcClusterMethods.getTaskListsByDomain({
      domain: decodedParams.domain,
    });

    const taskListNames = Array.from(
      new Set([
        ...Object.keys(response.decisionTaskListMap ?? {}),
        ...Object.keys(response.activityTaskListMap ?? {}),
      ])
    ).sort();

    return NextResponse.json({ taskListNames });
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: decodedParams, error: e },
      'Error fetching task lists by domain'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError
            ? e.message
            : 'Error fetching task lists by domain',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
