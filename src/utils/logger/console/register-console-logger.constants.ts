import { type LogLevel } from '..';

import { type ConsoleLogLevel } from './register-console-logger.types';

export const CONSOLE_LOG_LEVEL_TO_LOG_LEVEL_MAP: Record<
  ConsoleLogLevel,
  LogLevel
> = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  log: 'info',
  debug: 'debug',
};
