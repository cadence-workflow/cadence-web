import { NextResponse, type NextRequest } from 'next/server';

import logger from '@/utils/logger';

import logToServerPayloadSchema from './schemas/log-to-server-payload-schema';

export async function logToServer(request: NextRequest) {
  const requestBodyJSON = await request.json();
  const { data, error } = logToServerPayloadSchema.safeParse(requestBodyJSON);
  if (error) {
    return NextResponse.json(
      {
        error: 'Invalid argument(s) for logging to server',
        validationErrors: error.errors,
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
