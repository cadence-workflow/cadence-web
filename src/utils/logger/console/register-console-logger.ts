import { isString } from 'lodash';

import { type Logger } from '..';

import stripEscapesFromNextLog from './helpers/strip-escapes-from-next-log';
import {
  CONSOLE_LOG_LEVEL_TO_LOG_LEVEL_MAP,
  NEXTJS_ERROR_PREFIX,
} from './register-console-logger.constants';
import { type ConsoleLogLevel } from './register-console-logger.types';

/**
 * Registers a custom logger to override the default console logging used by Next.js.
 * See: https://github.com/vercel/next.js/discussions/63787#discussioncomment-11978877
 */
export default function registerConsoleLogger(
  logger: Logger,
  consoleLogLevel: ConsoleLogLevel
) {
  const level = CONSOLE_LOG_LEVEL_TO_LOG_LEVEL_MAP[consoleLogLevel];

  return (...args: unknown[]) => {
    const messages = args.filter(isString);
    const parsedMessage = stripEscapesFromNextLog(messages.join(' ')).trim();

    const errors = args.filter((arg) => arg instanceof Error);

    const restData = args.filter(
      (arg) => !isString(arg) && !(arg instanceof Error)
    );

    logger[level](
      {
        ...(restData.length > 0 ? { data: restData } : {}),
        ...(errors.length > 0 ? { errors } : {}),
      },
      errors[0] instanceof Error &&
        (!parsedMessage || parsedMessage === NEXTJS_ERROR_PREFIX)
        ? errors[0].message
        : parsedMessage
    );
  };
}
