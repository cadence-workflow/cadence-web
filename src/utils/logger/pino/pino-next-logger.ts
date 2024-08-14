/*
  Configuration file to create a sibling logger for next-logger to use.
  nextLoggerConfig contains a logMethod function that formats Next's logger
  payload to work with Pino.
*/

import { type LoggerOptions, pino } from 'pino';

import LOGGER_CONFIG from './pino.config';
import { type CustomLevels } from './pino.types';

const getNextLogger = (nextLoggerConfig: LoggerOptions<CustomLevels>) =>
  pino<CustomLevels>({ ...nextLoggerConfig, ...LOGGER_CONFIG });

export default getNextLogger;
