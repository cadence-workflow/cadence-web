// Logger
import logger from './pino/pino';
export { default as getNextLogger } from './pino/pino-next-logger';

// Register logger
export { registerLoggers } from './logger-register';

// Constants
export const LOG_LEVELS = Object.values(logger.levels.labels);

// Types
export { type LogLevel as LogLevel } from './pino/pino.types';

export default logger;
