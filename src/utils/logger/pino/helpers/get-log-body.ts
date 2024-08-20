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
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent,
      // TODO @adhitya.mamallan: add a field for "userUuid" once we start sending it for auth
      // userUuid: ...
      url: {
        base: window.location.origin + window.location.pathname,
        searchParams: Object.fromEntries(
          new URLSearchParams(window.location.search)
        ),
        hash: window.location.hash,
      },
      messages: event.messages,
      bindings: event.bindings,
      source: 'browser',
    },
  };
}
