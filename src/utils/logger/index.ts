// Logger
import logger from './pino/pino';

// Register logger
export { registerLoggers } from './logger-register';

// Constants
export const LOG_LEVELS = Object.values(logger.levels.labels);

// Types
export { type LogLevel as LogLevel } from './pino/pino.types';
export * from './logger.types';

export default logger;
