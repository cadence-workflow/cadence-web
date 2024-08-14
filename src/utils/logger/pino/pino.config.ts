import type { LoggerOptions } from 'pino';

import getLogBody from './helpers/get-log-body';
import { type CustomLevels } from './pino.types';

const isDevelopment = process.env.NODE_ENV === 'development';

const LOGGER_CONFIG: LoggerOptions<CustomLevels> = {
  level: isDevelopment ? 'trace' : 'info',
  formatters: {
    level(label, number) {
      return { level: isDevelopment ? number : label };
    },
  },
  // To add custom levels, update the corresponding type and add the level values here
  // customLevels: {
  //   silly: 5,
  // },
  browser: {
    transmit: {
      level: 'warn',
      send: (level, logEvent) => {
        navigator.sendBeacon(
          '/api/log',
          JSON.stringify(getLogBody(level, logEvent))
        );
      },
    },
  },
};

export default LOGGER_CONFIG;
