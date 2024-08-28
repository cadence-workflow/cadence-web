import { NextResponse, type NextRequest } from 'next/server';

import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import logToServerPayloadSchema from './schemas/log-to-server-payload-schema';

export async function logToServer(request: NextRequest) {
  const requestBodyJSON = await request.json();
  const { data, error } = logToServerPayloadSchema.safeParse(requestBodyJSON);
  if (error) {
    logger.error<RouteHandlerErrorPayload>(
      { cause: error },
      'Failed to parse log from browser'
    );

    return NextResponse.json(
      {
        message: 'Could not log browser log on server',
        cause: error.errors,
      },
      {
        status: 400,
      }
    );
  }

  const { level, message, payload } = data;

  logger[level](payload, message);

  return NextResponse.json({
    status: 200,
  });
}
