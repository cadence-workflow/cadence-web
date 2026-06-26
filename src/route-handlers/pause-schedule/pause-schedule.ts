import { type NextRequest, NextResponse } from 'next/server';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import pauseScheduleRequestBodySchema from './schemas/pause-schedule-request-body-schema';
import {
  type Context,
  type PauseScheduleResponse,
  type RequestParams,
} from './pause-schedule.types';

export async function pauseSchedule(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const requestBody = await request.json();
  const { data, error } = pauseScheduleRequestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for schedule pause',
        validationErrors: error.errors,
      },
      { status: 400 }
    );
  }

  const params = requestParams.params;

  if (!params.scheduleId) {
    return NextResponse.json(
      { message: 'Missing scheduleId in route params' },
      { status: 400 }
    );
  }

  try {
    await ctx.grpcClusterMethods.pauseSchedule({
      domain: params.domain,
      scheduleId: params.scheduleId,
      reason: data.reason,
      identity: ctx.userInfo?.id,
    });

    return NextResponse.json({} satisfies PauseScheduleResponse);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error pausing schedule'
    );

    return NextResponse.json(
      {
        message: e instanceof GRPCError ? e.message : 'Error pausing schedule',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
