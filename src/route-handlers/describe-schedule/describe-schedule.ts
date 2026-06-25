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

    // TODO: Remove after design validation — mock backfills for UI preview
    const mockResponse: DescribeScheduleResponse = {
      ...response,
      info: {
        ...(response.info ?? {
          lastRunTime: null,
          nextRunTime: null,
          totalRuns: '0',
          createTime: null,
          lastUpdateTime: null,
          missedRuns: '0',
          skippedRuns: '0',
        }),
        ongoingBackfills: [
          {
            backfillId: 'backfill-2025-q2-001',
            startTime: { seconds: '1746057600', nanos: 0 },
            endTime: { seconds: '1748736000', nanos: 0 },
            runsCompleted: 7,
            runsTotal: 10,
          },
          {
            backfillId: 'backfill-2025-q1-002',
            startTime: { seconds: '1738368000', nanos: 0 },
            endTime: { seconds: '1743638400', nanos: 0 },
            runsCompleted: 14,
            runsTotal: 14,
          },
        ],
      },
    };

    return NextResponse.json(mockResponse);
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
