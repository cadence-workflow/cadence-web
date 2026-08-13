import { type NextRequest, NextResponse } from 'next/server';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import type {
  Context,
  DescribeScheduleResponse,
  RequestParams,
  RouteParams,
} from './describe-schedule.types';

export async function describeSchedule(
  _: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const params = requestParams.params as RouteParams;

  try {
    const response: DescribeScheduleResponse =
      await ctx.grpcClusterMethods.describeSchedule({
        domain: params.domain,
        scheduleId: params.scheduleId,
      });

    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error fetching schedule details' +
        (e instanceof GRPCError ? ': ' + e.message : '')
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError
            ? e.message
            : 'Error fetching schedule details',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
