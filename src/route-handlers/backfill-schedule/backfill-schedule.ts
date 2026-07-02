import { type NextRequest, NextResponse } from 'next/server';

import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import transformBackfillScheduleBodyToGrpcInput from './helpers/transform-backfill-schedule-body-to-grpc-input';
import backfillScheduleRequestBodySchema from './schemas/backfill-schedule-request-body-schema';
import {
  type BackfillScheduleResponse,
  type Context,
  type RequestParams,
} from './backfill-schedule.types';

export async function backfillSchedule(
  request: NextRequest,
  requestParams: RequestParams,
  ctx: Context
) {
  const requestBody = await request.json().catch(() => ({}));
  const { data, error } =
    backfillScheduleRequestBodySchema.safeParse(requestBody);

  if (error) {
    return NextResponse.json(
      {
        message: 'Invalid values provided for schedule backfill',
        validationErrors: error.errors,
      },
      { status: 400 }
    );
  }

  const params = requestParams.params;

  try {
    const response = await ctx.grpcClusterMethods.backfillSchedule(
      transformBackfillScheduleBodyToGrpcInput({
        domain: params.domain,
        scheduleId: params.scheduleId,
        body: data,
      })
    );

    return NextResponse.json(response satisfies BackfillScheduleResponse);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>(
      { requestParams: params, error: e },
      'Error backfilling schedule'
    );

    return NextResponse.json(
      {
        message:
          e instanceof GRPCError ? e.message : 'Error backfilling schedule',
        cause: e,
      },
      { status: getHTTPStatusCode(e) }
    );
  }
}
