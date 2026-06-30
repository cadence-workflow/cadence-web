import { type NextRequest, NextResponse } from 'next/server';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  type Context,
  type DeleteScheduleResponse,
  type RequestParams,
} from './delete-schedule.types';

export async function deleteSchedule(
  _: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const params = requestParams.params;

  try {
    await ctx.grpcClusterMethods.deleteSchedule({
      domain: params.domain,
      scheduleId: params.scheduleId,
    });

    return NextResponse.json({} satisfies DeleteScheduleResponse);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error deleting schedule'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error deleting schedule',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
