import { type NextRequest, NextResponse } from 'next/server';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import transformUpdateScheduleBodyToGrpcInput from './helpers/transform-update-schedule-body-to-grpc-input';
import updateScheduleRequestBodySchema from './schemas/update-schedule-request-body-schema';
import {
  type Context,
  type RequestParams,
  type UpdateScheduleResponse,
} from './update-schedule.types';

export async function updateSchedule(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const requestBody = await request.json().catch(() => ({}));
  const { data, error } =
    updateScheduleRequestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for schedule update',
        validationErrors: error.errors,
      },
      { status: 400 }
    );
  }

  const params = requestParams.params;

  try {
    const response = await ctx.grpcClusterMethods.updateSchedule(
      transformUpdateScheduleBodyToGrpcInput({
        domain: params.domain,
        scheduleId: params.scheduleId,
        body: data,
      })
    );

    return NextResponse.json(response satisfies UpdateScheduleResponse);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error updating schedule'
    );

    return NextResponse.json(
      {
        message: e instanceof GRPCError ? e.message : 'Error updating schedule',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
