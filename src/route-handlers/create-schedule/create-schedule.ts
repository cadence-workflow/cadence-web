import crypto from 'crypto';
import { NextResponse, type NextRequest } from 'next/server';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import { type Context, type RequestParams } from './create-schedule.types';
import transformCreateScheduleBodyToGrpcInput from './helpers/transform-create-schedule-body-to-grpc-input';
import createScheduleRequestBodySchema from './schemas/create-schedule-request-body-schema';

export async function createSchedule(
  request: NextRequest,
  options: RequestParams,
  ctx: Context
) {
  const params = options.params;
  const requestBody = await request.json();
  const { data, error } =
    createScheduleRequestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for schedule create',
        validationErrors: error.errors,
      },
      { status: 400 }
    );
  }

  const scheduleId = data.scheduleId ?? crypto.randomUUID();
  const grpcPayload = transformCreateScheduleBodyToGrpcInput({
    domain: params.domain,
    body: { ...data, scheduleId },
  });

  try {
    const response = await ctx.grpcClusterMethods.createSchedule(grpcPayload);
    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error creating schedule' +
        (e instanceof GRPCError ? ': ' + e.message : '')
    );

    return NextResponse.json(
      {
        message: e instanceof GRPCError ? e.message : 'Error creating schedule',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
