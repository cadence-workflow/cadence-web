/* eslint-disable no-console */
/* Registering console loggers in this file */

import logger from '.';
import registerConsoleLogger from './console/register-console-logger';

export function registerLoggers() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const consoleLogger = logger.child({ name: 'console' });
    console.error = registerConsoleLogger(consoleLogger, 'error');
    console.log = registerConsoleLogger(consoleLogger, 'log');
    console.info = registerConsoleLogger(consoleLogger, 'info');
    console.warn = registerConsoleLogger(consoleLogger, 'warn');
    console.debug = registerConsoleLogger(consoleLogger, 'debug');
  }
}
