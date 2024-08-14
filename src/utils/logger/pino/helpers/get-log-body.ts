import { type Level, type LogEvent } from 'pino';

import { type LogToServerBody } from '@/route-handlers/log-to-server/log-to-server.types';

export default function getLogBody(
  level: Level,
  event: LogEvent
): LogToServerBody {
  return {
    level,
    message:
      event.messages.find((msg) => typeof msg === 'string') ??
      'Log from browser',
    payload: {
      browserTimestamp: event.ts,
      messages: event.messages,
      bindings: event.bindings,
      source: 'browser',
    },
  };
}
