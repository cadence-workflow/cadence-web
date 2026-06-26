import { type NextRequest, NextResponse } from 'next/server';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import unpauseScheduleRequestBodySchema from './schemas/unpause-schedule-request-body-schema';
import {
  type Context,
  type RequestParams,
  type UnpauseScheduleResponse,
} from './unpause-schedule.types';

export async function unpauseSchedule(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const requestBody = await request.json();
  const { data, error } =
    unpauseScheduleRequestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for schedule unpause',
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
    await ctx.grpcClusterMethods.unpauseSchedule({
      domain: params.domain,
      scheduleId: params.scheduleId,
      reason: data.reason,
      catchUpPolicy: data.catchUpPolicy,
    });

    return NextResponse.json({} satisfies UnpauseScheduleResponse);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error unpausing schedule'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error unpausing schedule',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
